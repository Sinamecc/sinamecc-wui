export interface Permissions {
    all:{
        reviewer: boolean,
        provider: boolean,
        admin: boolean
    },
    mitigation_action:{
        reviewer:boolean
        provider:boolean
    },
    ppcn:{
        reviewer:boolean
        provider:boolean
    },
    mccr:{
        reviewer:boolean
        provider:boolean
    },
    report_data:{
        reviewer:boolean
        provider:boolean
    },
}