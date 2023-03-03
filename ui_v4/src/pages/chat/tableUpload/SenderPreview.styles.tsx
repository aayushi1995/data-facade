import { Typography } from "antd"
import Paragraph from "antd/es/typography/Paragraph"
import styled from "styled-components"

export const UploadFileContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    gap: 16px;

    width: 200.11px;
    height: 64px;

    background: #FFFFFF;

    border: 1px solid #D1D5DB;
    border-radius: 8px;

    flex: none;
    order: 1;
    flex-grow: 0;
`   
export const FileNameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px;
    gap: 4px;
    width: 98px;
    height: 32px;
    flex: none;
`

export const Filename = styled(Paragraph)`
width: 98px;
margin-top:1em;
overflow: hidden;
font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 14px;
display: flex;
align-items: center;
color: #4B5563;
flex: none;
`
export const FileSendBy = styled.p`
width: 98px;
height: 13px;
font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 12px;
display: flex;
align-items: center;
color: #9CA3AF;
flex: none;
margin: 0px;
order: 1;
flex-grow: 0;
`