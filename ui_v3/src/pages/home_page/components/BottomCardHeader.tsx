import { HeadeCssOfCard } from "./CSS/CssProperties"

export const BottomCardheader = (props:{DisplayName: string})=>{
    return(
            <HeadeCssOfCard>
                {props.DisplayName}
            </HeadeCssOfCard>
    )
}

export default BottomCardheader