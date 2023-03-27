import { ReactQueryWrapper } from '@/components/ReactQueryWrapper/ReactQueryWrapper';
import useFetchTags from '@/components/TagHandler/useFetchTags';
import { labels } from '@/helpers/constant';
import DatafacadeDatatype from '@/helpers/enums/DatafacadeDatatype';
import { useTableAndColumnStats } from '@/hooks/tableView/ColumnInfoViewHooks';
import TableComponent from '@/pages/chat/chatActionOutput/TableChartComponent/TableComponent';
import { DownOutlined, MoreOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Input, Popover, Progress, Row, Select, Table, Tag, Tooltip, Typography } from 'antd';
import React, { ChangeEvent, useState } from "react";
import { formDataGridPropsFromResponse, isDataGridRenderPossible, useColumn, useColumnDataTypeMutation, useTableView } from './TableViewHooks';
// import RunWorkflowButton from '../../../../common/components/RunWorkflowButton';

const TableView = (props: { TableId?: string ,showBTN?:boolean }) => {
    const tableViewQuery = useTableView({ TableId: props.TableId, options: {} })
    const [searchQuery, setSearchQuery] = useState<string | undefined>("")
    const handleSearchChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchQuery(event?.target.value)
    }

    const tableCardStyle = {
        borderRadius: '8px', 
        boxShadow: '0px 1.01276px 1.01276px rgba(0, 0, 0, 0.1), 0px 0px 1.01276px rgba(0, 0, 0, 0.25)' 
    }
    
    const tableProps = formDataGridPropsFromResponse(tableViewQuery.data, searchQuery)
    console.log(tableProps.dataSource);
    const dataSource:any = tableProps.dataSource
    
    console.log(dataSource);
    console.log(tableProps.columns);
    
    const dataColumn = tableProps.columns;
    return (
        <div>
            <Row>
                <Col span={24}>
                    <Input
                        value={searchQuery}
                        onChange={handleSearchChange} />
                </Col>
                {props.showBTN &&
                <Col span={24}>
                    <Card>
                        <div>
                            {/* <RunWorkflowButton TableId={props.TableId} /> */}
                        </div>
                    </Card>
                </Col>
                } 
            </Row>
            <Card>
                <div>
                    <ReactQueryWrapper
                        isLoading={tableViewQuery.isLoading}
                        error={tableViewQuery.error}
                        data={tableViewQuery.data}>
                            <>
                            {
                            tableProps.dataSource &&
                            // <Table 
                            // columns={dataColumn}
                            // dataSource={dataSource}
                            // />
                            <TableComponent dataGridColumns={dataColumn} dataGridRows={dataSource}/>
                            }
                            </>
                        </ReactQueryWrapper>
                </div>
            </Card>
        </div>
    )
}

export interface TableViewColumnHeaderProps {
    ColumnId: string
}

export const TableViewColumnHeader = (props: TableViewColumnHeaderProps) => {
    const { ColumnId } = props

    const columnQuery = useColumn({ ColumnId: ColumnId, options: {} })
    const tableAndColumnStatsQuery = useTableAndColumnStats({ TableId: columnQuery?.data?.TableId })
    const coumnDatatypeMutation = useColumnDataTypeMutation({
        options: {
            onSuccess: () => columnQuery.refetch()
        }
    })

    const onColumnDatatypeChange = (newDatatype: string, columnId?: string) => {
        coumnDatatypeMutation.mutate({
            columnId: columnId,
            newDataType: newDatatype
        })
    }

    return (
        <ReactQueryWrapper
            isLoading={columnQuery.isLoading}
            error={columnQuery.error}
            data={columnQuery.data}
            children={() =>
                <div>
                    <div>
                        <div>
                            <Tooltip title={columnQuery?.data?.UniqueName || ""}>
                                <Typography>
                                    {columnQuery?.data?.UniqueName}
                                </Typography>
                            </Tooltip>
                        </div>
                        <div>
                            <MoreOutlined />
                        </div>
                    </div>
                    <Divider/>
                    <div>
                            <Select
                                defaultValue={columnQuery?.data?.Datatype}
                                style={{ width: 120 }}
                                onChange={(event:any) => { event.stopPropagation(); onColumnDatatypeChange(event.target.value, columnQuery?.data?.Id) }}
                                options={[
                                    { value: `${DatafacadeDatatype.BOOLEAN}` , label: `${DatafacadeDatatype.BOOLEAN}` },
                                    { value: `${DatafacadeDatatype.STRING}`, label: `${DatafacadeDatatype.STRING}` },
                                    { value: `${DatafacadeDatatype.INT}`, label: `${DatafacadeDatatype.INT}` },
                                    { value: `${DatafacadeDatatype.FLOAT}`, label: `${DatafacadeDatatype.FLOAT}`},
                                ]}
                                />
                    </div>
                    <Divider/>
                    <div>
                        <ColumnHeaderTagSelector ColumnId={ColumnId} />
                    </div>
                    <div>
                        <ReactQueryWrapper
                            isLoading={tableAndColumnStatsQuery.isLoading}
                            error={tableAndColumnStatsQuery.error}
                            data={tableAndColumnStatsQuery.data}
                            children={() => {
                                const columnHealth = tableAndColumnStatsQuery?.data?.ColumnInfoAndStats?.find(columnInfo => columnInfo?.ColumnName === columnQuery?.data?.UniqueName)?.ColumnStat?.Health
                                return (
                                    <Tooltip title={columnHealth !== undefined ? `${((columnHealth || 0) * 100).toFixed(2)} %` : "Fetching"}>
                                        <Progress percent={(columnHealth || 0) * 100} />
                                    </Tooltip>
                                )
                            }}
                        />
                    </div>
                </div>
            }
        />
    )
}

export type ColumnHeaderTagSelectorProps = {
    ColumnId: string
}

export const ColumnHeaderTagSelector = (props: ColumnHeaderTagSelectorProps) => {
    const chipStyle = {
        fontFamily: "SF Pro Text",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "13px",
        lineHeight: "24px",
        display: "flex",
        alignItems: "center",
        letterSpacing: "0.073125px",
        color: "ActionDefinationHeroTextColor1.main",
        borderRadius: '5px',
        py: 1
    }
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [tagsSelectedForEntity, tagsNotSelectedButAvaialbleForEntity, isLoading, isMutating, error, addTag, createAndAddTag, deleteTag] = useFetchTags({
        entityType: labels.entities.ColumnProperties,
        entityId: props?.ColumnId!,
        tagFilter: { Scope: labels.entities.ColumnProperties }
    })

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getTagChips = (howMany?: number, chipMaxWidth: string = "auto") => {
        const tagsToShow = tagsSelectedForEntity.slice(0, howMany || tagsSelectedForEntity.length)
        const tagCount = tagsToShow.length
        tagCount === 0 && tagsToShow.push("No Tags")
        tagCount !== tagsSelectedForEntity.length && tagsToShow.push(`+${tagsSelectedForEntity.length - tagsToShow.length} Tags`)
        return tagsToShow.map((tagName, index) => {
            const tag = <Tag
                            key={`${index}-tag-chip`}
                            closable={index !== 0}
                            style={{ ...chipStyle, maxWidth: chipMaxWidth }}
                            onClose={index < tagCount ? () => deleteTag(tagName) : undefined}
                        >{tagName}</Tag>
          
         
            return <Tooltip title={tagName}>{tag}</Tooltip>
        })
    }

    return (
        <ReactQueryWrapper
            isLoading={isLoading}
            error={error}
            data={tagsSelectedForEntity}
            children={() =>
        <>
            <div onClick={handleClick}>
                <div>
                    <div>
                        <div>
                            <Typography onClick={handleClick}>
                                Add / Show Tag
                            </Typography>
                        </div>
                        <div>
                        <DownOutlined />
                        </div>
                    </div>
                    <div>
                        <Divider/>
                    </div>
                    <div>
                        {getTagChips(1, "100px")}
                    </div>
                </div>
            </div>

            {/* <Popover
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Row>
                    <Col span={24}>
                        <Autocomplete
                            options={tagsNotSelectedButAvaialbleForEntity}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            disabled={(isLoading || isMutating || (!!error))}
                            onChange={(event, value, reason, details) => {
                                if (!!value) {
                                    if (value?.includes("Create Tag: ")) {
                                        createAndAddTag(value.substring(12))
                                    } else {
                                        addTag(value)
                                    }
                                }
                            }}
                            renderInput={(params) => <Input {...params} label="Add Tag" />}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                if (params.inputValue !== '') {
                                    filtered.push(`Create Tag: ${params.inputValue}`);
                                }
                                return filtered;
                            }}
                            size="small"
                        />
                    </Col>
                    <Col span={24}>
                        <div>
                            {getTagChips(undefined)}
                        </div>
                    </Col>
                </Row>
            </Popover> */}
            </>
            }
            />
    )
}


export default TableView;