import styled from '@emotion/styled';
import { TextField, TextFieldProps, Typography } from "@mui/material";
import { TypographyProps } from "@mui/system";




export const StyledTypographyDataHeader = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontFamily: 'Sans',
    fontSize: '1.3rem',
    fontWeight: 600,
    textAlign: 'center'
}))

export const IconConatiner = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    gap: 1
}

export const SearchBarTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: '60%',
    margin: 'auto',
    marginBottom: '8px',
    backgroundColor: '#EBF1FA',
    boxSizing: 'border-box',
    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5)',
    backgroundBlendMode: 'soft-light, normal',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '50px'
}))

export const SearchBarDialogTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: '30vw',
    margin: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '50px',
    border: '0.539683px solid rgba(0, 0, 0, 0.23)'
}))

export const ActionCardHeader = {
    color: '#367BF5',
    fontFamily: 'Sans',
    fontWeight: 600,
    fontSize: '0.9rem',
    mr: 1,
    overflow: 'hidden'
}

export const ActionCardDescription = {
    color: '#47576A',
    fontFamily: 'Sans',
    fontWeight: 400,
    fontSize: '0.7rem'
}

export const ActionCardButtonContainer = {
    borderTop: 'solid 1px #E3E5E6',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    p: 1,
    height:'4vh'
}

export const ActionCardConatier = {
    backgroundColor: '#EBF1FA',
    boxShadow:'0px 1px 1px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.25)',
    px: 3,
    py: 2,
    borderRadius:'8px',
    height: '48vh',
    overflowY: 'scroll'
}

export const ContainerHeader = {
    color: '#007DFA',
    px: 1,
    fontWeight: 600,
    fontFamily: 'Sans'
}

export const appCardContainer = {
    display: 'flex',
    width: '300px',
    px: 1,
    py: 2
}
export const PackagesNameStyle = {
    color: 'rgba(0, 0, 0, 0.87)',
    fontFamily: 'Sans',
    mr:3
}
export const NumberofItemInPackage = {
    ml: 'auto',
    color: '#919699'
}
export const PackageTabHeader = {
    mt: 1,
    backgroundColor: '#EAEBEF',
    borderTopRightRadius: '25px',
    borderBottomRightRadius: '25px',
    py: 1,
    ...ContainerHeader,
    px: 4,
    mr: 3
}
export const PackagesNameStyleR = {
    fontFamily: 'sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600
}
export const SeeAllPackage = {
    ml: 'auto',
    textDecoration: 'none',
    fontFamily: 'sans-serif',
    fontWeight: 600,
    color: '#367BF5'
}
export const DialogBGcolor = {
    backgroundColor: '#EBF1FA'
}
export const DialogHeader = {
    borderBottom: '1px solid #C0C1C1',
    backgroundColor:'#EBF1FA',
    display: 'flex'
}
export const DialogBody = {
    display: 'flex',
    height: '70vh',
    backgroundColor:'#EBF1FA',
}
export const AllPackageList = {
    mt: 1,
    width: '30%',
    height: '70vh',
    overflow: 'scroll',
    boxShadow: '-1px -1px 1px #FAFBFF, 1px 1px 1px ',
    backgroundColor: '#FFFFFF',
    borderRadius:'8px'
}
export const AllApps = {
    width: '70%',
    height: '70vh',
    overflow: 'scroll',
    backgroundColor:'#EBF1FA'
}
export const HeaderButtonsStyle = {
    display: 'flex',
    cursor: 'pointer'
}

export const CursorPointer = {
    cursor: 'pointer'
}

export const AppCardStyle = {
    width: '100%', 
    cursor:'pointer',
    ":hover": { 
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)' ,
        backgroundColor:'#F6F8FC'

    }
}

export const ScratchPadTabStyle = {
    width: '150px',
    margin: '15px',
    backgroundColor: 'white',
    border: '1px solid #d1d1d1',
    cursor: 'pointer',
    display: 'flex',
    borderRadius: '10px',
    alignItems: 'center',
    justifyContent: 'center'
}