import React from 'react';
import { Tag } from '../../../../generated/entities/Entities';
import useCreateTag from './createTag';
import useFetchAvailableTags from './useFetchAvailableTags';

export interface UseFetchTagsParams {
    selectedTags: Tag[],
    onSelectedTagsChange?: (newTags: Tag[]) => void
    tagFilter: Tag
}

const useFetchVirtualTags = (params: UseFetchTagsParams): [Tag[], Tag[], boolean, boolean, any, (tagName: string) => void, (tagName: string) => void, (tagName: string) => void] => {
    const {selectedTags, onSelectedTagsChange, tagFilter} = params
    
    const {data: avaialbleTagsData, error: avaialbleTagsError, isLoading: avaialbleTagsIsLoading} = useFetchAvailableTags({tagFilter})
    
    const selectedTagsId: string[] = selectedTags.map(tag => tag.Id!)
    const availableTagsForEntity = (avaialbleTagsData as Tag[])?.filter(availableTag => !selectedTagsId.includes(availableTag.Id!)) || []
    
    const createAndAddTagMutation = useCreateTag({
        tagFilter: tagFilter,
        createTagMutationOptions: {
            onSuccess: (data, variables, context) => {
                if(!!data && data.length === 1) {
                    onSelectedTagsChange?.([...selectedTags, data[0]])
                } else {
                    console.log("Erroneous Response for Tag Creation", data, error, context)
                }
            }
        }
    })

    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isMutating, setIsMutating]  = React.useState<boolean>(false)
    const [error, setError] = React.useState<any>()

    // Set Loading status
    React.useEffect(() => {
        setIsLoading(avaialbleTagsIsLoading)
    }, [avaialbleTagsIsLoading])

    // Set Mutating status
    React.useEffect(() => {
        setIsMutating(createAndAddTagMutation.isLoading)
    }, [createAndAddTagMutation.isLoading])

    // Set Error status
    React.useEffect(() => {
        if(!!avaialbleTagsError){setError(avaialbleTagsError)}
        if(!!createAndAddTagMutation.error){setError(createAndAddTagMutation.error)}
    }, [avaialbleTagsError, createAndAddTagMutation.error])

    
    const deleteTag = (tagName: string) => onSelectedTagsChange?.(selectedTags.filter(selectedTag => selectedTag.Name!==tagName))
    const addTag = (tagName: string) => onSelectedTagsChange?.([...selectedTags, availableTagsForEntity?.find(tag => tag?.Name===tagName)!])
    const createAndAddTag = (tagName: string) => {createAndAddTagMutation.mutate({tagModel: {Name: tagName}})}

    return [
        selectedTags,
        availableTagsForEntity,
        isLoading,
        isMutating,
        error,
        deleteTag,
        addTag,
        createAndAddTag
    ]
}

export default useFetchVirtualTags;







