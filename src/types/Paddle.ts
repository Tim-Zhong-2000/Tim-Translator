export namespace Paddle {
  interface TextBlock {
    confidence: number;
    text: string;
    text_region: number[][];
  }

  type ImageResult = TextBlock[];

  export interface Payload {
    msg: string;
    results: ImageResult[];
  }
}
