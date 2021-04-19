import './Common.css';
import { IMusicBoxProfile, BuiltInProfiles } from '../model/IMusicBoxProfile';
import React, { useState } from 'react';
import { Card, NumericInput, Button, Label, H4, Callout, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { MidiNote } from '../model/MidiConstants';

export interface IMusicBoxProfileEditorProps {
    profile: IMusicBoxProfile;
    onChange(profile: IMusicBoxProfile): void;
}

export function MusicBoxProfileEditor(props: IMusicBoxProfileEditorProps) {
    const [profile, setProfile] = useState(props.profile);

    const onApplyProfile = () => {
        if (props.onChange) {
            props.onChange(profile);
        }
    }

    const onSelectProfile = (profileKey: string) => {
        const newProfile = { ...BuiltInProfiles[profileKey] };
        setProfile(newProfile);
        if (props.onChange) {
            props.onChange(newProfile);
        }
    }

    let menuItems: JSX.Element[] = [];
    for (const profile in BuiltInProfiles) {
        menuItems.push(
            <MenuItem key={profile} text={BuiltInProfiles[profile].name} onClick={() => onSelectProfile(profile)} />);
    }

    const profileSelectionMenu = <Menu>{menuItems} </Menu>;
    const profileSelectionPopOver =
        <Popover content={profileSelectionMenu} position={Position.BOTTOM}>
            <Button icon="document-open" text="Select profile..." />
        </Popover>;

    return (
        <Card className={'mb-MusicBoxProfileEditor'}>
            <H4><span>{profileSelectionPopOver} Music Box Profile: {profile.name}</span></H4>
            <div className={'mb-settingLayout'}>
                <div className={'mb-settingGroup'}>
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
                    <Label>
                        Minimum Note Gap (mm)
                        <NumericInput
                            value={profile.minNoteGapMm}
                            onValueChange={(num, str) => { setProfile({ ...profile, minNoteGapMm: num }) }} />
                    </Label>
                </div>
                <div className={'mb-settingGroup'}>
                    <Label>
                        Millimeters per second
                        <NumericInput
                            value={profile.millimetersPerSecond}
                            onValueChange={(num, str) => { setProfile({ ...profile, millimetersPerSecond: num }) }} />
                    </Label>
                    <Label>
                        Hole diameter (mm)
                        <NumericInput
                            value={profile.holeDiameterMm}
                            onValueChange={(num, str) => { setProfile({ ...profile, holeDiameterMm: num }) }} />
                    </Label>
                    <Button onClick={onApplyProfile}>Apply</Button>
                </div>
                <div className={'mb-settingGroup'}>
                    <Callout>
                        Supported Notes: {profile.supportedNotes.map(x => MidiNote[x].replace('s', '#')).join(', ')}
                    </Callout>
                </div>
            </div>
        </Card>
    );
}