import CONFIG from "../utils/config";
import sqlite3 = require("sqlite3");
import ISO963_1 from "../type/ISO963";
import { CacheEngine } from "../translator/abstract/cacheEngine";
import { Payload, TranslateLevel } from "../type/Translator";
import { checkArrayType, NumberChecker } from "../utils/checkArrayType";
import { generatePayload } from "../utils/generatePayload";

export class TeamTrans {
  db: sqlite3.Database;
  constructor() {
    this.db = new sqlite3.Database(CONFIG["team-trans"].db.host || ":memory:");
    /**
     * hash = provider | src | srcLang | destLang
     * provider = 用户id
     * privacy = 见类型 PrivacyLabel
     * level = 见类型 type/Translator.TranslateLevel
     * src = 源文本
     * dest = 翻译文本
     * srcLang = 见类型 type/ISO963
     * destLang = 见类型 type/ISO963
     */
    this.db.run(
      "CREATE TABLE IF NOT EXISTS data (\
            hash        TEXT      NOT NULL,\
            provider    INTEGER   NOT NULL,\
            privacy     INTEGER   NOT NULL,\
            level       INTEGER   NOT NULL,\
            src         TEXT      NOT NULL,\
            dest        TEXT      NOT NULL,\
            srcLang     TEXT      NOT NULL,\
            destLang    TEXT      NOT NULL\
        )"
    );
  }

  /**
   * 添加一条人工翻译
   * 如果已存在，修改当前翻译
   * @param src
   * @param srcLang
   * @param dest
   * @param destLang
   * @param provider
   * @param privacy
   */
  async add(
    src: string,
    srcLang: ISO963_1,
    dest: string,
    destLang: ISO963_1,
    provider: number,
    privacy: number
  ) {
    let stmt: sqlite3.Statement;
    try {
      if (await this.isExist(src, srcLang, destLang, provider)) {
        return await this.update(
          src,
          srcLang,
          dest,
          destLang,
          provider,
          privacy
        );
      } else {
        return await this.insert(
          src,
          srcLang,
          dest,
          destLang,
          provider,
          privacy
        );
      }
    } catch (err) {}
  }

  private insert(
    src: string,
    srcLang: ISO963_1,
    dest: string,
    destLang: ISO963_1,
    provider: number,
    privacy: number
  ) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        "INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?)"
      );
      stmt.run(
        CacheEngine.generateHashKey(
          src,
          srcLang,
          destLang,
          provider.toString()
        ),
        provider,
        privacy,
        TranslateLevel.USER,
        src,
        dest,
        srcLang,
        destLang
      );
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  private update(
    src: string,
    srcLang: ISO963_1,
    dest: string,
    destLang: ISO963_1,
    provider: number,
    privacy: number
  ) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        "UPDATE data SET dest=(?) privacy=(?) WHERE hash=(?)"
      );
      stmt.run(
        dest,
        privacy,
        CacheEngine.generateHashKey(src, srcLang, destLang, provider.toString())
      );
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  /**
   * 获取翻译
   * @param src
   * @param srcLang
   * @param destLang
   * @param providers
   */
  async get(
    src: string,
    srcLang: ISO963_1,
    destLang: ISO963_1,
    providers: number[]
  ): Promise<Payload[]> {
    if (!checkArrayType(providers, NumberChecker)) {
      throw new Error("Type Unsafe");
    }
    const len = providers.length;
    let sql = "SELECT provider,dest,level FROM data WHERE privacy<2 AND (";
    for (let i = 0; i < len; i++) {
      sql += " hash = ? ";
      if (i !== len - 1) {
        sql += "OR";
      } else {
        sql += ")";
      }
    }
    const result: Payload[] = [];
    const query = new Promise((resolve, reject) => {
      this.db.each(
        sql,
        (_: any, err: Error, row: any) => {
          result.push(
            generatePayload(
              true,
              row.level,
              src,
              row.dest,
              srcLang,
              destLang,
              row.provider.toString()
            )
          );
        },
        (err, count) => {
          if (err) reject(err);
          else resolve(count);
        }
      );
    });
    await query;
    return result;
  }

  /**
   * 删除翻译
   * @param src
   * @param srcLang
   * @param destLang
   * @param provider
   */
  delete(src: string, srcLang: ISO963_1, destLang: ISO963_1, provider: number) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        "DELETE FROM data WHERE provider=(?) AND src=(?) AND srcLang=(?) AND destLang=(?)"
      );
      stmt.run(provider, src, srcLang, destLang);
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  isExist(
    src: string,
    srcLang: ISO963_1,
    destLang: ISO963_1,
    provider: number
  ) {
    const hash = CacheEngine.generateHashKey(
      src,
      srcLang,
      destLang,
      provider.toString()
    );
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("SELECT NULL FROM data WHERE hash=(?)");
      stmt.run(hash);
      stmt.each(
        () => {},
        (err, count) => {
          if (err) reject(err);
          else if (count === 0) resolve(false);
          else if (count === 1) resolve(true);
          else throw new Error("more than one row");
        }
      );
    });
  }
}
