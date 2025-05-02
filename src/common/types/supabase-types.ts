export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			activity: {
				Row: {
					billable: boolean;
					contract: number;
					created_at: string;
					description: string;
					end_time: string | null;
					id: number;
					non_billable_reason: string | null;
					start_time: string | null;
					ticket: number;
					user: string;
				};
				Insert: {
					billable?: boolean;
					contract: number;
					created_at?: string;
					description: string;
					end_time?: string | null;
					id?: number;
					non_billable_reason?: string | null;
					start_time?: string | null;
					ticket: number;
					user: string;
				};
				Update: {
					billable?: boolean;
					contract?: number;
					created_at?: string;
					description?: string;
					end_time?: string | null;
					id?: number;
					non_billable_reason?: string | null;
					start_time?: string | null;
					ticket?: number;
					user?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'activity_contract_fkey';
						columns: ['contract'];
						isOneToOne: false;
						referencedRelation: 'contract';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'activity_ticket_fkey';
						columns: ['ticket'];
						isOneToOne: false;
						referencedRelation: 'ticket';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'activity_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					}
				];
			};
			comment: {
				Row: {
					content: string;
					created_at: string;
					id: number;
					ticket: number;
					user: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: number;
					ticket: number;
					user: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: number;
					ticket?: number;
					user?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'comment_ticket_fkey';
						columns: ['ticket'];
						isOneToOne: false;
						referencedRelation: 'ticket';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					}
				];
			};
			company: {
				Row: {
					additionalInformation: string | null;
					address: string;
					created_at: string | null;
					createdBy: string | null;
					description: string;
					email: string | null;
					id: number;
					industry: string;
					locations: string[] | null;
					logo: string | null;
					name: string;
					phone: string;
					registerationdate: string | null;
					size: string;
					status: string;
					tags: string[] | null;
					website: string;
				};
				Insert: {
					additionalInformation?: string | null;
					address?: string;
					created_at?: string | null;
					createdBy?: string | null;
					description?: string;
					email?: string | null;
					id?: number;
					industry?: string;
					locations?: string[] | null;
					logo?: string | null;
					name: string;
					phone?: string;
					registerationdate?: string | null;
					size?: string;
					status?: string;
					tags?: string[] | null;
					website?: string;
				};
				Update: {
					additionalInformation?: string | null;
					address?: string;
					created_at?: string | null;
					createdBy?: string | null;
					description?: string;
					email?: string | null;
					id?: number;
					industry?: string;
					locations?: string[] | null;
					logo?: string | null;
					name?: string;
					phone?: string;
					registerationdate?: string | null;
					size?: string;
					status?: string;
					tags?: string[] | null;
					website?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'company_createdBy_fkey';
						columns: ['createdBy'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					}
				];
			};
			company_users: {
				Row: {
					accessLevel: string;
					company: number;
					created_at: string;
					user: string;
				};
				Insert: {
					accessLevel: string;
					company: number;
					created_at?: string;
					user: string;
				};
				Update: {
					accessLevel?: string;
					company?: number;
					created_at?: string;
					user?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'company_users_company_fkey';
						columns: ['company'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'company_users_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					}
				];
			};
			contract: {
				Row: {
					company: number;
					contract_type: string;
					created_at: string;
					id: number;
					price: number;
					quota: number | null;
					sla_resolution_time: number | null;
					sla_response_time: number | null;
					title: string;
				};
				Insert: {
					company: number;
					contract_type: string;
					created_at?: string;
					id?: number;
					price: number;
					quota?: number | null;
					sla_resolution_time?: number | null;
					sla_response_time?: number | null;
					title?: string;
				};
				Update: {
					company?: number;
					contract_type?: string;
					created_at?: string;
					id?: number;
					price?: number;
					quota?: number | null;
					sla_resolution_time?: number | null;
					sla_response_time?: number | null;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'contract_company_fkey';
						columns: ['company'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'contract_quota_fkey';
						columns: ['quota'];
						isOneToOne: false;
						referencedRelation: 'quota';
						referencedColumns: ['id'];
					}
				];
			};
			domain: {
				Row: {
					company: number;
					created_at: string;
					domain: string;
					id: number;
				};
				Insert: {
					company: number;
					created_at?: string;
					domain: string;
					id?: number;
				};
				Update: {
					company?: number;
					created_at?: string;
					domain?: string;
					id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'domain_company_fkey';
						columns: ['company'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					}
				];
			};
			domain_projects: {
				Row: {
					created_at: string;
					domain: number;
					id: number;
					project: number;
				};
				Insert: {
					created_at?: string;
					domain: number;
					id?: number;
					project: number;
				};
				Update: {
					created_at?: string;
					domain?: number;
					id?: number;
					project?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'domain_projects_domain_fkey';
						columns: ['domain'];
						isOneToOne: false;
						referencedRelation: 'domain';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'domain_projects_project_fkey';
						columns: ['project'];
						isOneToOne: false;
						referencedRelation: 'project';
						referencedColumns: ['id'];
					}
				];
			};
			project: {
				Row: {
					attachments: string[] | null;
					clientInformation: string | null;
					company: number;
					contract: number;
					created_at: string;
					createdBy: string | null;
					description: string;
					dueDate: string;
					id: number;
					links: string[] | null;
					name: string;
					priority: string;
					startDate: string;
					status: string;
					tags: string[] | null;
					visibility: boolean;
				};
				Insert: {
					attachments?: string[] | null;
					clientInformation?: string | null;
					company: number;
					contract: number;
					created_at?: string;
					createdBy?: string | null;
					description?: string;
					dueDate: string;
					id?: number;
					links?: string[] | null;
					name: string;
					priority?: string;
					startDate: string;
					status: string;
					tags?: string[] | null;
					visibility?: boolean;
				};
				Update: {
					attachments?: string[] | null;
					clientInformation?: string | null;
					company?: number;
					contract?: number;
					created_at?: string;
					createdBy?: string | null;
					description?: string;
					dueDate?: string;
					id?: number;
					links?: string[] | null;
					name?: string;
					priority?: string;
					startDate?: string;
					status?: string;
					tags?: string[] | null;
					visibility?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: 'project_company_fkey';
						columns: ['company'];
						isOneToOne: false;
						referencedRelation: 'company';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_contract_fkey';
						columns: ['contract'];
						isOneToOne: false;
						referencedRelation: 'contract';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_createdBy_fkey';
						columns: ['createdBy'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					}
				];
			};
			quota: {
				Row: {
					block_rule: string;
					created_at: string;
					hours: number;
					id: number;
					last_reset_date: string | null;
					notification_threshold: number;
					period: string;
					reset_date: string | null;
				};
				Insert: {
					block_rule: string;
					created_at?: string;
					hours: number;
					id?: number;
					last_reset_date?: string | null;
					notification_threshold: number;
					period: string;
					reset_date?: string | null;
				};
				Update: {
					block_rule?: string;
					created_at?: string;
					hours?: number;
					id?: number;
					last_reset_date?: string | null;
					notification_threshold?: number;
					period?: string;
					reset_date?: string | null;
				};
				Relationships: [];
			};
			ticket: {
				Row: {
					assignee: string | null;
					attachments: string[] | null;
					category: string;
					created_at: string;
					createdBy: string;
					csat: number | null;
					details: string;
					id: number;
					priority: string;
					project: number;
					resolutionDate: string | null;
					resolutionSummary: string | null;
					source: string | null;
					status: string;
					tags: string[] | null;
					title: string;
				};
				Insert: {
					assignee?: string | null;
					attachments?: string[] | null;
					category: string;
					created_at?: string;
					createdBy: string;
					csat?: number | null;
					details: string;
					id?: number;
					priority: string;
					project: number;
					resolutionDate?: string | null;
					resolutionSummary?: string | null;
					source?: string | null;
					status: string;
					tags?: string[] | null;
					title: string;
				};
				Update: {
					assignee?: string | null;
					attachments?: string[] | null;
					category?: string;
					created_at?: string;
					createdBy?: string;
					csat?: number | null;
					details?: string;
					id?: number;
					priority?: string;
					project?: number;
					resolutionDate?: string | null;
					resolutionSummary?: string | null;
					source?: string | null;
					status?: string;
					tags?: string[] | null;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'ticket_assignee_fkey';
						columns: ['assignee'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'ticket_createdBy_fkey';
						columns: ['createdBy'];
						isOneToOne: false;
						referencedRelation: 'user_details';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'ticket_project_fkey';
						columns: ['project'];
						isOneToOne: false;
						referencedRelation: 'project';
						referencedColumns: ['id'];
					}
				];
			};
			user_details: {
				Row: {
					accessLevel: string | null;
					created_at: string;
					email: string;
					firstName: string | null;
					id: string;
					lastName: string | null;
					role: string;
					status: string;
				};
				Insert: {
					accessLevel?: string | null;
					created_at?: string;
					email: string;
					firstName?: string | null;
					id: string;
					lastName?: string | null;
					role: string;
					status: string;
				};
				Update: {
					accessLevel?: string | null;
					created_at?: string;
					email?: string;
					firstName?: string | null;
					id?: string;
					lastName?: string | null;
					role?: string;
					status?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			fetch_users_of_company: {
				Args: {
					company_id?: number;
				};
				Returns: {
					accessLevel: string | null;
					created_at: string;
					email: string;
					firstName: string | null;
					id: string;
					lastName: string | null;
					role: string;
					status: string;
				}[];
			};
			hello_world: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			new: {
				Args: {
					company_id: number;
				};
				Returns: Record<string, unknown>;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
	? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
	? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never;
