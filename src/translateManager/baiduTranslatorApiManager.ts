/**
 * @description 百度翻译API总模块
 */
import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { DefaultFilter } from "../filter/filter";
import { BaiduTranslatorAPI } from "../translateEngines/baiduTranslatorApi";
import { DestPayload } from "../type/type";
import { generateDestPayload } from "../utils/generateDestPayload";

export class BaiduTranslatorApiManager extends TranslateManager {
  constructor(
    translateEngine: BaiduTranslatorAPI,
    cacheEngine: MapCache,
    filter: DefaultFilter
  ) {
    super(translateEngine, cacheEngine, filter);
  }

  async translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<DestPayload> {
    let dest: DestPayload = null;

    const filterResult = this.filter.exec(src, srcLang);
    switch (filterResult.type) {
      case "pass":
        src = filterResult.text;
        break;
      case "proxy":
        dest = generateDestPayload(
          true,
          "verified",
          src,
          filterResult.text,
          srcLang,
          destLang
        );
        return dest;
      case "block":
        dest = generateDestPayload(
          true,
          "ai",
          "",
          filterResult.text,
          srcLang,
          destLang
        );
        return dest;
    }

    try {
      dest = this.readCache(src, srcLang, destLang);
    } catch (error) {
      try {
        dest = await this.translateEngine.translate(src, srcLang, destLang);
        if (dest.success) this.writeCache(dest);
      } catch (error) {
        dest = generateDestPayload(
          false,
          "ai",
          src,
          "服务器未知错误",
          srcLang,
          destLang
        );
      }
    }
    return dest;
  }

  writeCache(
    dest: DestPayload
  ): void {
    this.cacheEngine.insert(dest);
  }

  readCache(src: string, srcLang: string, destLang: string): DestPayload {
    return this.cacheEngine.fetch(src, srcLang, destLang);
  }
}
