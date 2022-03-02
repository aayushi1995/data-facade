
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
	 Updates the action definition properties. You can also send the updated template in the 'new' property of the request.
	 It will edit the text of aciton template along with the action definition.
	 You can't edit the parameter definition with this API. Only definition level details and template text. Update will fail otherwise.
	 */
	 
	 static async fetchData(httpsVerb: "PATCH", endpoint: "/updateActionDefinitionWithTemplate", inputPayload: CustomInterface.UpdateActionDefinitionWithTemplate): Promise<Entity.ActionDefinition[]>; 
	 
	 /**
	 Gives you the the action instances for the given filter
	 */
	 
	 static async fetchData(httpsVerb: "GET", endpoint: "/getActionInstances", inputPayload: Entity.ActionInstance): Promise<Entity.ActionInstance[]>; 
	 
	 /**
	 Gives you the details of an action definition. Details include the definition tags, it's template and parameters all with their respective tags
	 */
	 
	 static async fetchData(httpsVerb: "GET", endpoint: "/getActionDefinitionDetails", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionDefinitionDetail[]>; 
	 
	 /**
	 Gives you the details of all tags along with it's subsidiaries.
	 */
	 
	 static async fetchData(httpsVerb: "GET", endpoint: "/getTagDetailsWithSubsidiary", inputPayload: Entity.Tag): Promise<CustomInterface.TagDetails[]>; 
	 
	 /**
	 Gives you the details of an application. It's actions, workflows etc.
	 */
	 
	 static async fetchData(httpsVerb: "GET", endpoint: "/getApplicationDetails", inputPayload: Entity.Application): Promise<CustomInterface.ApplicationDetails[]>; 
	 
	 /**
	 For a single workflow, this endpoint gives you the list of child Action Instances and it's parameters.
	 This api does not create the instances but gives you the instances json with some prefilled values and the user has to input the rest.
	 The response will be a list of interface WorkflowActionInstances
	 */
	 
	 static async fetchData(httpsVerb: "GET", endpoint: "/getWorkflowActionInstances", inputPayload: Entity.ActionDefinition): Promise<CustomInterface.ActionInstanceWithParameters[]>; 
	 
	 /**
	 Saves the action instance along with it's parameters. Also creates an action execution by default after it's creation is complete
	 */
	 
	 static async fetchData(httpsVerb: "POST", endpoint: "/saveInstanceWithParameters", inputPayload: CustomInterface.ActionInstanceWithParameters): Promise<Entity.ActionInstance[]>; 
	 
	 /**
	 Retrieves an action instance based on the filter and updates it with new properties
	 */
	 
	 static async fetchData(httpsVerb: "PATCH", endpoint: "/updateActionInstance", inputPayload: CustomInterface.UpdateRequest<Entity.ActionInstance>): Promise<Entity.ActionInstance[]>; 
	 
	 
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
 
 
 