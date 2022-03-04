import React from 'react';
import {v4 as uuidv4} from 'uuid'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TagMapCreatedBy from '../../../../enums/TagMapCreatedBy';
import { Tag, TagMap } from '../../../../generated/entities/Entities';
import labels from '../../../../labels/labels';
import dataManagerInstance, { useRetreiveData } from './../../../../data_manager/data_manager'
import TagGroups from '../../../../enums/TagGroups';
import useFetchAvailableTags from './useFetchAvailableTags';

export interface UseFetchTagsParams {
    entityType: string,
    entityId: string,
    tagFilter: Tag
}

const useFetchTags = (params: UseFetchTagsParams): [string[], string[], boolean, boolean, any, (tagName: string) => void, (tagName: string) => void, (tagName: string) => void] => {
    const {entityType, entityId, tagFilter} = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const queryClient = useQueryClient()

    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isMutating, setIsMutating]  = React.useState<boolean>(false)
    const [error, setError] = React.useState<any>()

    const [tagsNotSelectedButAvaialbleForEntity, setTagsNotSelectedButAvaialbleForEntity] = React.useState<string[]>([])
    const [tagsSelectedForEntity, setTagsSelectedForEntity] = React.useState<string[]>([])

    const {data: tagMapsOnEntityData, error: tagMapsOnEntityError, isLoading: tagMapsOnEntityIsLoading} = useQuery([labels.entities.TAG_MAP, entityType, entityId],
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.TAG_MAP, {
                filter: {
                    RelatedEntityType: entityType,
                    RelatedEntityId: entityId
                }
            })
        },{
            staleTime: 60*1000
        }
    )
    
    const {data: avaialbleTagsForEntityData, error: avaialbleTagsForEntityError, isLoading: avaialbleTagsForEntityIsLoading} = useFetchAvailableTags({tagFilter})

    // Delete Tag Map
    const deleteTagMapMutation = useMutation((config: { tagName: string }) => {
        return fetchedDataManagerInstance.deleteData!(
            labels.entities.TAG_MAP,
            {
                filter: {
                    RelatedEntityType: entityType,
                    RelatedEntityId: entityId,
                    TagName: config.tagName
                }
            })
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries([labels.entities.TAG_MAP, entityType, entityId])
        }
    })
    // Create Tag Map
    const createTagMapMutation = useMutation((config: { tagMapModel: TagMap }) => {
        return fetchedDataManagerInstance.saveData(
            labels.entities.TAG_MAP,
            {
                entityProperties: {
                    Id: uuidv4(),
                    RelatedEntityType: entityType,
                    RelatedEntityId: entityId,
                    CreatedBy: TagMapCreatedBy.USER,
                    CreatedOn:Date.now(),
                    ...config.tagMapModel
                }
            })
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries([labels.entities.TAG_MAP, entityType, entityId])
        }
    })
    // Create Tag
    const createTagMutation = useMutation((config: { tagModel: Tag }) => {
        return fetchedDataManagerInstance.saveData(
            labels.entities.TAG,
            {
                entityProperties: {
                    Id: uuidv4(),
                    TagGroup: TagGroups.GENERIC,
                    CreatedBy: TagMapCreatedBy.USER,
                    CreatedOn:Date.now(),
                    ...config.tagModel,
                    ...tagFilter
                }
            })
    },
    {
        onSuccess: (data: Tag[], variables, context) => {
            console.log(data)
            queryClient.invalidateQueries([labels.entities.TAG, tagFilter])
            createTagMapMutation.mutate({
                tagMapModel: {
                    TagName: data[0].Name
                }
            })
        }
    })

    // Set Tags Not Selected But Avaialble For Entity = Tags Avaialble For Entity - Assigned Tags
    React.useEffect(() => {
        if(!!avaialbleTagsForEntityData && !!tagMapsOnEntityData) {
            const availableTagNames: string[] = (avaialbleTagsForEntityData as Tag[]).map(availableTag => availableTag.Name!)
            const assignedTagNames: string[] = (tagMapsOnEntityData as TagMap[]).map(tagMap => tagMap.TagName!)
            setTagsNotSelectedButAvaialbleForEntity(
                availableTagNames.filter(tagName => !assignedTagNames.includes(tagName))
            )
        }
    }, [avaialbleTagsForEntityData, tagMapsOnEntityData])
    
    // Set Tags Selected For Entity to just Names instead of TagMap models
    React.useEffect(() => {
        if(!!tagMapsOnEntityData) {
            const assignedTagNames: string[] = (tagMapsOnEntityData as TagMap[]).map(tagMap => tagMap.TagName!)
            setTagsSelectedForEntity(assignedTagNames)
        }
    }, [tagMapsOnEntityData])

    // Set Loading status
    React.useEffect(() => {
        setIsLoading(tagMapsOnEntityIsLoading||avaialbleTagsForEntityIsLoading)
    }, [tagMapsOnEntityIsLoading, avaialbleTagsForEntityIsLoading])

    // Set Mutating status
    React.useEffect(() => {
        setIsMutating(createTagMapMutation.isLoading||deleteTagMapMutation.isLoading)
    }, [createTagMapMutation.isLoading, deleteTagMapMutation.isLoading])

    // Set Error status
    React.useEffect(() => {
        if(!!tagMapsOnEntityError){setError(tagMapsOnEntityError)}
        if(!!avaialbleTagsForEntityError){setError(avaialbleTagsForEntityError)}
    }, [tagMapsOnEntityError, avaialbleTagsForEntityError])

    
    const deleteTag = (tagName: string) => {deleteTagMapMutation.mutate({"tagName": tagName})}
    const addTag = (tagName: string) => {createTagMapMutation.mutate({tagMapModel: {TagName: tagName}})}
    const createAndAddTag = (tagName: string) => {createTagMutation.mutate({tagModel: {Name: tagName}})}

    return [
        tagsSelectedForEntity, // Tags set on Entity
        tagsNotSelectedButAvaialbleForEntity, // Tags not set but available for entity
        isLoading, 
        isMutating,
        error, 
        addTag,
        createAndAddTag,
        deleteTag]
}

export default useFetchTags;







