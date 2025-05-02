export enum UserRole {
	Customer = 'customer',
	Admin = 'admin',
}

export enum UserStatus {
	Active = 'active',
	Inactive = 'inactive',
	Pending = 'pending',
}

export enum CompanyStatus {
	Active = 'active',
	Inactive = 'inactive',
	Pending = 'pending',
}

export enum CompanySize {
	Small = 'small',
	Medium = 'medium',
	Large = 'large',
}

export enum UserLevels {
	L1 = 'L1',
	L2 = 'L2',
	L3 = 'L3',
}

export enum ProjectStatus {
	Active = 'active',
	OnHold = 'on-hold',
	Completed = 'completed',
	Archived = 'archived',
}

export enum TicketStatus {
	Open = 'open',
	InProgress = 'in-progress',
	Resolved = 'resolved',
	Closed = 'closed',
}

export enum TicketPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
	Urgent = 'urgent',
}

export enum TicketCategory {
	Bug = 'bug',
	FeatureReq = 'feature-request',
	Inquiry = 'inquiry',
}

export enum Period {
	Daily = 'daily',
	Weekly = 'weekly',
	Biweekly = 'biweekly',
	Monthly = 'monthly',
	Bimonthly = 'bimonthly',
	Quarterly = 'quarterly',
	Semiannual = 'semiannual',
	Yearly = 'yearly',
}

export enum BlockRule {
	Soft = 'soft',
	Hard = 'hard',
}

export enum ContractType {
	ServiceNoQuota = 'service-no-quota',
	ServiceQuota = 'service-quota',
	ProjectFixed = 'project-fixed',
	ProjectTime = 'project-time',
}

export enum TimeEntry {
	Automatic = 'automatic',
	Manual = 'manual',
}
