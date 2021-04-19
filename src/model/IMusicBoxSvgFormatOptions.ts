/**
 * Any non-functional formatting (e.g., styling, pagination, etc) to apply to the generate svg.
 */
export interface IMusicBoxSvgFormatOptions {
    /**
     * Max page width, used for breaking a melody into multiple SVGs.
     * Only non-zero values have any effect
     */
    pageWidthMm: number;

    /**
     * Padding in millimeters before the start of the first note.
     */
    startPaddingMm: number;

    /** Whether to render the rectangular border */
    renderBorder: boolean;

    /** Omit page boundaries when paginating */
    omitPageBoundaries: boolean;

    /** Transpose out of range notes to within range if possible */
    transposeOutOfRangeNotes: boolean;

    /** Add jigsaw joiners to both start/end so that a loop can be created */
    loopMode: boolean;
}
