// Intl.Segmenter 最小类型声明（tsconfig lib 为 es2015，未含 ES2022.Intl；
// 运行时 Node 22 / Remotion 的 Chromium 均已内置）
declare namespace Intl {
    interface SegmentData {
        segment: string;
        index: number;
    }
    interface Segmenter {
        segment(input: string): Iterable<SegmentData>;
    }
    interface SegmenterOptions {
        granularity?: "grapheme" | "word" | "sentence";
        locale?: string;
    }
    var Segmenter: new (locale?: string, options?: SegmenterOptions) => Segmenter;
}
