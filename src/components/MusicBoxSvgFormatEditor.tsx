import "./Common.css";
import React, { useState } from "react";
import {
  Card,
  NumericInput,
  Button,
  Label,
  H4,
  Checkbox,
  Callout,
} from "@blueprintjs/core";
import { IMusicBoxSvgFormatOptions } from "../model/IMusicBoxSvgFormatOptions";

export interface IMusicBoxSvgFormatEditorProps {
  options: IMusicBoxSvgFormatOptions;
  onChange(options: IMusicBoxSvgFormatOptions): void;
}

export function MusicBoxSvgFormatEditor(props: IMusicBoxSvgFormatEditorProps) {
  const [options, setOptions] = useState(props.options);

  const onApplyChanges = () => {
    if (props.onChange) {
      props.onChange(options);
    }
  };

  return (
    <Card>
      <H4>
        <span>SVG Formatting Options</span>
      </H4>
      <div className={"mb-settingLayout"}>
        <div className={"mb-settingGroup"}>
          <Label>
            Maximum page width (mm)
            <NumericInput
              value={options.pageWidthMm}
              onValueChange={(num) => {
                setOptions({ ...options, pageWidthMm: num });
              }}
            />
          </Label>
          <Label>
            Maximum page height (mm)
            <NumericInput
              value={options.pageHeightMm}
              onValueChange={(num) => {
                setOptions({ ...options, pageHeightMm: num });
              }}
            />
          </Label>
          <Label>
            Start padding (mm)
            <NumericInput
              value={options.startPaddingMm}
              onValueChange={(num) => {
                setOptions({ ...options, startPaddingMm: num });
              }}
            />
          </Label>
          <Button onClick={onApplyChanges}>Apply</Button>
        </div>
        <div className={"mb-settingGroup"}>
          <Checkbox
            checked={options.renderBorder}
            label={"Render border"}
            onChange={() => {
              setOptions({ ...options, renderBorder: !options.renderBorder });
            }}
          />
          <Checkbox
            checked={options.omitPageBoundaries}
            label={"Omit page boundaries"}
            onChange={() => {
              setOptions({
                ...options,
                omitPageBoundaries: !options.omitPageBoundaries,
              });
            }}
          />
          <Checkbox
            checked={options.transposeOutOfRangeNotes}
            label={"Transpose out of range notes"}
            onChange={() => {
              setOptions({
                ...options,
                transposeOutOfRangeNotes: !options.transposeOutOfRangeNotes,
              });
            }}
          />
          <Checkbox
            checked={options.loopMode}
            label={"Loop mode"}
            onChange={() => {
              setOptions({ ...options, loopMode: !options.loopMode });
            }}
          />
          <Checkbox
            checked={options.jigsawJoiners}
            label={"Experimental: jigsaw joiners"}
            onChange={() => {
              setOptions({
                ...options,
                jigsawJoiners: !options.jigsawJoiners,
              });
            }}
          />
          <Callout>
            <p>Letter size: 216 x 279 mm</p>
            <p>A4 size: 210 x 297 mm</p>
          </Callout>
        </div>
      </div>
    </Card>
  );
}
