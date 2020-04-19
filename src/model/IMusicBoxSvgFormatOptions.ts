/**
 * Any non-functional formatting (e.g., styling, pagination, etc) to apply to the generate svg.
 */
export interface IMusicBoxSvgFormatOptions {
    /**
     * Max page width, used for breaking a melody into multiple SVGs.
     * Only non-zero values have any effect
     */
    pageWidthMm: number;
    /** Whether to render the rectangular border */
    renderBorder: boolean;
    /** Omit page boundaries when paginating */
    omitPageBoundaries: boolean;
}
