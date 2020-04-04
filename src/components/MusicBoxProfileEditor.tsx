import { IMusicBoxProfile } from "../model/MusicBox";
import { useState } from "react";
import { TextField, Button, makeStyles, Paper } from "@material-ui/core";
import React from "react";

export interface IMusicBoxProfileEditorProps {
    profile: IMusicBoxProfile;
    onChange(profile: IMusicBoxProfile): void;
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export function MusicBoxProfileEditor(props: IMusicBoxProfileEditorProps) {
    const classes = useStyles();

    const [profile, setProfile] = useState(props.profile);

    const handleClick = () => {
        if (props.onChange) {
            props.onChange(profile);
        }
    }

    return (
        <Paper className={classes.root}>
            <TextField
                label='Paper width (mm)'
                variant='outlined'
                type='number'
                value={profile.paperWidthMm}
                onChange={(ev) => { setProfile({ ...profile, paperWidthMm: parseInt(ev.target.value) }) }} />
            <TextField
                label='Content width (mm)'
                variant='outlined'
                type='number'
                value={profile.contentWidthMm}
                onChange={(ev) => { setProfile({ ...profile, contentWidthMm: parseInt(ev.target.value) }) }} />
            <Button onClick={handleClick}>Apply</Button>
        </Paper>
    );
}