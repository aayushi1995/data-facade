import { Grid, IconButton, Typography } from "@mui/material"
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

export interface StepSliderProps {
    label?: string,
    handleNext?: () => void
    handleBack?: () => void,
    currentIndex?: number,
    maximumIndex?: number
}

const StepSlider = (props: StepSliderProps) => {


    return (
        <Grid container spacing={2} alignItems='center'>
            <Grid item xs={3} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <IconButton disabled={props.currentIndex === 0} onClick={props.handleBack}>
                    <ArrowCircleLeftOutlinedIcon sx={{transform: 'scale(1.5)'}}/>
                </IconButton>
            </Grid>
            <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center'}}>
                <Typography sx={{
                    fontFamily: "SF Pro Display",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "11.5435px",
                    lineHeight: "160%",
                    textAlign: "center",
                    letterSpacing: "0.0961957px",
                    color: "typographyColor1.main"
                }}>
                    {props.label} {(props.currentIndex || 0) + 1}/{(props.maximumIndex || 0) + 1}
                </Typography>
            </Grid>
            <Grid item xs={3} sx={{display: 'flex'}}>
                <IconButton disabled={props.currentIndex === props.maximumIndex} onClick={props.handleNext}>
                    <ArrowCircleRightOutlinedIcon sx={{transform: 'scale(1.5)'}}/>
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default StepSlider