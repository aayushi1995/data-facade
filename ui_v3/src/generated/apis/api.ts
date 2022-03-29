
/**
 * This is a generated code based on API Yaml. Please don't edit it.
 * (c) Data Facade LLC.
 */  

import * as Entity from '../entities/Entities'
import * as CustomInterface from '../interfaces/Interfaces'
import dataManager from '../../data_manager/data_manager'
import { userSettingsSingleton } from '../../data_manager/userSettingsSingleton'

const endPoint = require("../../common/config/config").FDSEndpoint

type HttpsVerb = "GET" | "POST" | "PATCH"
export const isValidUserSettings = () => userSettingsSingleton.userEmail && userSettingsSingleton.token

export class Fetcher {
    
	/**
	Returns an ActionExecution along with it's ActionInstance and ActionDefinition
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/actionExecutionDetail", inputPayload: Entity.ActionExecution): Promise<CustomInterface.ActionExecutionIncludeDefinitionInstanceDetailsResponse[]>; 
	
	/**
	Returns data needed to render an Application Card
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/applicationCardView", inputPayload: Entity.Application): Promise<CustomInterface.ApplicationCardViewResponse[]>; 
	
	/**
	Returns data needed to render an Application Card
	*/
	
	static async fetchData(httpsVerb: "POST", endpoint: "/createApplication", inputPayload: CustomInterface.CreateApplicationRequest): Promise<Entity.Application[]>; 
	
	/**
	Gives you the details of an action definition. Details include the definition tags, it's template and parameters all with their respective tags
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getActionDefinitionDetails", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionDefinitionDetail[]>; 
	
	/**
	Gives you the the action instances for the given filter
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getActionInstances", inputPayload: Entity.ActionInstance): Promise<Entity.ActionInstance[]>; 
	
	/**
	Gives you the the action instances for the given filter along with it's details
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getActionInstancesDetail", inputPayload: Entity.ActionInstance): Promise<CustomInterface.ActionInstanceDetails[]>; 
	
	/**
	Gives you the details of an application. It's actions, workflows etc.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getApplicationDetails", inputPayload: Entity.Application): Promise<CustomInterface.ApplicationDetails[]>; 
	
	/**
	Gives you the the action definitions of the types that should be visible to the user.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getFilteredActionDefinitions", inputPayload: Entity.ActionDefinition): Promise<Entity.ActionDefinition[]>; 
	
	/**
	Gives you the the action instances that should be visible to the user.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getFilteredActionInstances", inputPayload: Entity.ActionInstance): Promise<Entity.ActionInstance[]>; 
	
	/**
	Gives you the number of runs on any provider in the last five days. Also gives you the list of provider parameter instances.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getProviderHistoryAndParameters", inputPayload: Entity.ProviderInstance): Promise<CustomInterface.ProviderRunsHistoryAndParameters[]>; 
	
	/**
	Gives you the details of a provider Instance. You give the filter in the request body.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getProviderInstanceDetails", inputPayload: Entity.ProviderInstance): Promise<CustomInterface.ProviderInstanceDetails[]>; 
	
	/**
	Gives you the details of all tags along with it's subsidiaries.
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getTagDetailsWithSubsidiary", inputPayload: Entity.Tag): Promise<CustomInterface.TagDetails[]>; 
	
	/**
	For a single workflow, this endpoint gives you the list of child Action Instances and it's parameters.
	This api does not create the instances but gives you the instances json with some prefilled values and the user has to input the rest.
	The response will be a list of interface WorkflowActionInstances
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getWorkflowActionInstances", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionInstanceWithParameters[]>; 
	
	/**
	Gives back a workflow based on tag matching of the table
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/getWorkflowForTableTags", inputPayload: Entity.TableProperties): Promise<CustomInterface.WorkflowStagesWithActions[]>; 
	
	/**
	Returns data needed to render an Action Definition Card
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/orgActionDefinitionCardView", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionDefinitionCardViewResponse[]>; 
	
	/**
	Returns data needed to render an Action Instance Card
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/orgActionInstanceCardView", inputPayload: Entity.ActionInstance): Promise<CustomInterface.ActionInstanceCardViewResponse[]>; 
	
	/**
	Returns data needed to render an Action Definition Card
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/pinnedActionDefinitionCardView", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionDefinitionCardViewResponse[]>; 
	
	/**
	Returns data needed to render an Action Instance Card
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/pinnedActionInstanceCardView", inputPayload: Entity.ActionInstance): Promise<CustomInterface.ActionInstanceCardViewResponse[]>; 
	
	/**
	Saves the action instance along with it's parameters. Also creates an action execution by default after it's creation is complete
	*/
	
	static async fetchData(httpsVerb: "POST", endpoint: "/saveInstanceWithParameters", inputPayload: CustomInterface.ActionInstanceWithParameters): Promise<Entity.ActionInstance[]>; 
	
	/**
	Updates the action definition properties. You can also send the updated template in the 'new' property of the request.
	It will edit the text of aciton template along with the action definition. You can add new parameters but not edit existing parameters using this API
	*/
	
	static async fetchData(httpsVerb: "PATCH", endpoint: "/updateActionDefinitionWithTemplateAndParameters", inputPayload: CustomInterface.UpdateActionDefinitionWithTemplate): Promise<Entity.ActionDefinition[]>; 
	
	/**
	Retrieves an action instance based on the filter and updates it with new properties
	*/
	
	static async fetchData(httpsVerb: "PATCH", endpoint: "/updateActionInstance", inputPayload: CustomInterface.UpdateRequest<Entity.ActionInstance>): Promise<Entity.ActionInstance[]>; 
	
	/**
	Gives details about child action executions of a workflow
	*/
	
	static async fetchData(httpsVerb: "GET", endpoint: "/workflowActionExecutionsStatus", inputPayload: Entity.ActionExecution): Promise<CustomInterface.WorkflowActionExecutions[]>; 
	
    
    static async fetchData(httpsVerb: HttpsVerb, endpoint: string, inputPayload: any): Promise<any> {
        const type = httpsVerb === 'GET' ? 'POST': httpsVerb
        const header = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `Bearer ${userSettingsSingleton.token}`
			},
			body: JSON.stringify(inputPayload)
		}

		const fn = await fetch(endPoint + `${endpoint}?email=` + userSettingsSingleton.userEmail, header)
		return fn.json()
    }
}


