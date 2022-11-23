import { useMutation, UseMutationOptions } from "react-query"
import dataManagerInstance from './../../../../data_manager/data_manager'
import { v4 as uuidv4} from 'uuid'
import TagGroups from "../../../../enums/TagGroups"
import TagMapCreatedBy from "../../../../enums/TagMapCreatedBy"
import { Tag } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"


export interface UseCreateTagParams {
    createTagMutationOptions: UseMutationOptions<Tag[],unknown, unknown, unknown>,
    tagFilter: Tag
}

const useCreateTag = (params: UseCreateTagParams) => {
        const { tagFilter, createTagMutationOptions } = params
        const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
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
        }, {
            ...createTagMutationOptions
        }
        )
    
        return createTagMutation;
}

export default useCreateTag;