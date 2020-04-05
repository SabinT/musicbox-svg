import { IMusicBoxProfile } from "../model/MusicBox";
import { useState } from "react";
import React from "react";
import { Card, NumericInput, Button, Label } from "@blueprintjs/core";

export interface IMusicBoxProfileEditorProps {
    profile: IMusicBoxProfile;
    onChange(profile: IMusicBoxProfile): void;
}

export function MusicBoxProfileEditor(props: IMusicBoxProfileEditorProps) {
    const [profile, setProfile] = useState(props.profile);

    const handleClick = () => {
        if (props.onChange) {
            props.onChange(profile);
        }
    }

    return (
        <Card>
            <Label>
                Paper width (mm)
                <NumericInput
                    value={profile.paperWidthMm}
                    onValueChange={(num, str) => { setProfile({ ...profile, paperWidthMm: num }) }} />
            </Label>
            <Label>
                Content width (mm)
                <NumericInput
                    value={profile.contentWidthMm}
                    onValueChange={(num, str) => { setProfile({ ...profile, contentWidthMm: num }) }} />
            </Label>
            <Button onClick={handleClick}>Apply</Button>
        </Card>
    );
}