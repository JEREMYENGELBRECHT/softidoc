$runningMode = $OctopusRunningMode
$identityServiceApiUrl = $OctopusIdentityServiceApiUrl
$recordStoreApplicationApiUrl = $OctopusRecordStoreApplicationApiUrl
$membershipMaintenanceApiUrl = $OctopusMembershipMaintenanceApiUrl
$signalRHubUrl = $OctopusSignalRHubUrl
$invalidsApiUrl = $OctopusInvalidsApiUrl
$workflowServicesUrl = $OctopusWorkflowServicesUrl
$policyQueryApiUrl = $OctopusPolicyQueryApiUrl
$applicationFormsUrl = $OctopusApplicationFormsUrl
$serviceErrorApiUrl = $OctopusServiceErrorUrl
$applicationformssearchapiurl = $OctopusSearchUrl 
$investmentsUrl = $OctopusInvestmentsUrl
$hermesMessagingMonitorApiUrl  = $OctopusHermesMessagingMonitorApiUrl
$hermesMessagingMonitorUnityUrl = $OctopusHermesMessagingMonitorUnityUrl
$buildNumber = $OctopusParameters["Octopus.Release.Number"] 
$encashmentsUnityUrl = $OctopusEncashmentsUnityUrl
$encashmentsApiUrl = $OctopusEncashmentsApiUrl
$policyUnityUrl = $OctopusPolicyUnityUrl
$identityMaintenanceUnityUrl = $OctopusIdentityMaintenanceUnityUrl
$investmentsIntegrationUrl = $OctopusInvestmentsIntegrationUrl
$presentationVenueUnityUrl = $OctopusPresentationVenueUnityUrl
$applicationFormSearchUnityUrl = $OctopusApplicationFormSearchUnityUrl
$presentationVenueApiUrl = $OctopusPresentationVenueApiUrl
$outboundSmsUnityUrl = $OctopusOutboundSmsUnityUrl
$outboundSmsApiUrl = $OctopusOutboundSmsApiUrl
$applicationFormCapturePresentationUrl = $OctopusApplicationFormsCaptureUnityUrl
$communicationUnityUrl = $OctopusCommunicationUnityUrl	
$emsApiUrl = $OctopusEmsApiUrl
$emsUnityUrl = $OctopusEmsUnityUrl
$financeApiUrl = $OctopusFinanceApiUrl
$financeUnityUrl = $OctopusFinanceUnityUrl
$trainingApiUrl = $OctopusTrainingApiUrl
$trainingUnityUrl = $OctopusTrainingUnityUrl
$financeWorkflowApiUrl = $OctopusFinanceWorkflowApiUrl
$OcrRecordIndexerApplicationUrl = $OctopusOcrRecordIndexerApplicationUrl
$RecordIndexerApiUrl = $OctopusRecordIndexerApiUrl
$BankValUrl = $OctopusBankValUrl
$BankValApiUrl = $OctopusBankValApiUrl
$ClienteleGatewayUnityUrl = $OctopusClienteleGatewayUnityUrl
$ClienteleGatewayApiUrl = $OctopusClienteleGatewayApiUrl
$DocumentDigitizerUnityUrl = $OctopusDocumentDigitizerUnityUrl
$DocumentDigitizerApiUrl = $OctopusDocumentDigitizerApiUrl
$policyOdsQueryApiUrl = $OctopusPolicyOdsQueryApiUrl
$PolicyAdministrationApplicationUrl = $OctopusPolicyAdministrationApplicationUrl
$PolicyAdministrationApiUrl = $OctopusPolicyAdministrationApiUrl
$AttendanceRegistersApplicationUrl = $OctopusAttendanceRegistersApplicationUrl
$AttendanceRegisterApiUrl = $OctopusAttendanceRegisterApiUrl
$supplierUnityUrl = $OctopusSupplierUnityUrl
$supplierApiUrl = $OctopusSupplierApiUrl
$ClaimsApiUrl = $OctopusClaimsApiUrl
$ClaimsApplicationUrl = $OctopusClaimsApplicationUrl
$ClaimsCacheFlushUrl = $OctopusClaimsCacheFlushUrl
$GsdApiUrl = $OctopusGsdApiUrl
$GsdAdminUnityUrl = $OctopusGsdAdminUnityUrl
$MediaManagementApiUrl = $OctopusMediaManagementApiUrl
$MediaManagementApplicationUrl = $OctopusMediaManagementApplicationUrl
$FraudRiskApiUrl = $OctopusFraudRiskUrl
$FraudRiskUnityUrl = $OctupusFraudRiskUnityUrl
<<<<<<< HEAD
=======
$OutboundCommunicationApiUrl = $OctopusOutboundCommunicationApiUrl
$OutboundCommunicationUnityUrl = $OctopusOutboundCommunicationUnityUrl
$QualityAssuranceApplicationUrl= $OctopusQualityAssuranceApplicationUrl
$QualityAssuranceApiUrl= $OctopusQualityAssuranceApiUrl
>>>>>>> b3e9a91f1cf207d1eb3e15ba5d166457c856b0bb

set-content Configuration/serverConfiguration.json "`
{`
""runningMode"": ""$runningMode"", ""applicationId"": {},`
""noAccessRightsUrl"": ""/NoAccessRights/"", ""identityNotFoundUrl"": `
""/IdentityNotFound/"", ""applicationIcon"": """", ""useAuth"": ""true"",  `
""identityServiceApiUrl"": ""$identityServiceApiUrl"", `
""recordStoreApplicationApiUrl"": ""$recordStoreApplicationApiUrl"",`
""membershipMaintenanceApiUrl"":""$membershipMaintenanceApiUrl"",`
""signalRHubUrl"":""$signalRHubUrl"",`
""applicationFormsUrl"":""$applicationFormsUrl"",`
""policyQueryApiUrl"":""$policyQueryApiUrl"", `
""policyOdsQueryApiUrl"":""$policyOdsQueryApiUrl"", `
""serviceErrorApiUrl"":""$serviceErrorApiUrl"",`
""applicationFormTrackingSearchUrl"":""$applicationformssearchapiurl"",`
""investmentsUrl"":""$OctopusInvestmentsUrl"",`
""presentationVenueApiUrl"":""$OctopusPresentationVenueApiUrl"",`
""hermesMessagingMonitorApiUrl"":""$hermesMessagingMonitorApiUrl"",`
""encashmentApiUrl"":""$encashmentsApiUrl"",`
""hermesMessagingMonitorUnityUrl"": { ""ApplicationId"": ""Hermes.MessagingMonitor"", ""UnityUrl"": ""$hermesMessagingMonitorUnityUrl""},`
""encashmentsUnityUrl"": { ""ApplicationId"": ""Clientele.Encashments"", ""UnityUrl"": ""$encashmentsUnityUrl""}, `
""policyUnityUrl"": { ""ApplicationId"": ""Clientele.Policy"", ""UnityUrl"": ""$policyUnityUrl""}, `
""identityMaintenanceUnityUrl"": { ""ApplicationId"": ""Clientele.IdentityMaintenance"", ""UnityUrl"": ""$identityMaintenanceUnityUrl""}, `
""investmentsIntegrationUrl"": { ""ApplicationId"": ""Clientele.Investments"", ""UnityUrl"": ""$investmentsIntegrationUrl""}, `
""outboundSmsUnityUrl"": { ""ApplicationId"": ""Clientele.OutboundSms"", ""UnityUrl"": ""$outboundSmsUnityUrl""}, `
""outboundSmsApiUrl"":""$outboundSmsApiUrl"",`
""venueIntegrationLocationUrl"": { ""ApplicationId"": ""Clientele.VenueLocation"", ""UnityUrl"": ""$presentationVenueUnityUrl"" }, `
""applicationFormSearchIntegrationUrl"": { ""ApplicationId"": ""Clientele.Search.SearchService"", ""UnityUrl"": ""$applicationFormSearchUnityUrl"" }, `
""applicationFormsCapturePresentationUrl"": { ""ApplicationId"": ""Clientele.ApplicationFormsCapture"", ""UnityUrl"": ""$applicationFormCapturePresentationUrl"" }, `
""communicationUnityUrl"": { ""ApplicationId"": ""Clientele.Communication"", ""UnityUrl"": ""$communicationUnityUrl""}, `
""emsUnityUrl"": { ""ApplicationId"": ""EMS"", ""UnityUrl"": ""$emsUnityUrl""}, `
""emsApiUrl"":""$emsApiUrl"",`
""trainingUnityUrl"": { ""ApplicationId"": ""Clientele.Training"", ""UnityUrl"": ""$trainingUnityUrl""}, `
""trainingApiUrl"":""$trainingApiUrl"",`
""financeUnityUrl"": { ""ApplicationId"": ""Clientele.Finance"", ""UnityUrl"": ""$financeUnityUrl""}, `
""financeApiUrl"":""$financeApiUrl"",`
""financeWorkflowApiUrl"":""$financeWorkflowApiUrl"",`
""ocrRecordIndexerApplicationUrl"": { ""ApplicationId"": ""Clientele.OcrRecordIndexer"", ""UnityUrl"": ""$OcrRecordIndexerApplicationUrl""}, `
""recordIndexerApiUrl"":""$RecordIndexerApiUrl"",`
""BuildNumber"" : ""$buildNumber"",`
""clienteleGatewayUnityUrl"": { ""ApplicationId"": ""Clientele.ClienteleGateway"", ""UnityUrl"": ""$ClienteleGatewayUnityUrl""},`
""clienteleGatewayApiUrl"":""$ClienteleGatewayApiUrl"",`
""bankValidationUnityUrl"": { ""ApplicationId"": ""Clientele.BankAccountValidation"", ""UnityUrl"": ""$BankValUrl""}, `
""bankAccountValidationApiUrl"":""$BankValApiUrl"", `
""documentDigitizerApplicationUrl"": { ""ApplicationId"": ""Clientele.DocumentDigitizer"", ""UnityUrl"": ""$DocumentDigitizerUnityUrl"" },
""documentDigitizerApiUrl"": ""$DocumentDigitizerApiUrl"", `
""policyAdministrationApplicationUrl"": { ""ApplicationId"": ""Clientele.PolicyAdministration"", ""UnityUrl"": ""$PolicyAdministrationApplicationUrl"" }, `
""policyAdministrationApiUrl"": ""$PolicyAdministrationApiUrl"",`
""clienteleClaimsApiUrl"": ""$ClaimsApiUrl"",`
""clienteleClaimsUnityUrl"": { ""ApplicationId"": ""Clientele.LifeClaims"", ""UnityUrl"": ""$ClaimsApplicationUrl"", ""CacheFlushUrl"": ""$ClaimsCacheFlushUrl"" }, `
""attendanceRegisterUrl"": { ""ApplicationId"": ""Clientele.AttendanceRegisters"", ""UnityUrl"": ""$AttendanceRegistersApplicationUrl"" }, `
""attendanceRegisterApiUrl"": ""$AttendanceRegisterApiUrl""`,
""supplierUnityUrl"": { ""ApplicationId"": ""Suppliers"", ""UnityUrl"": ""$supplierUnityUrl""}, `
""supplierApiUrl"":""$supplierApiUrl""`,
""gsdApiUrl"":""$GsdApiUrl""`,
""gsdAdminUnityUrl"": { ""ApplicationId"": ""Clientele.GsdAdmin"", ""UnityUrl"": ""$GsdAdminUnityUrl""}, `
""mediaManagementApiUrl"":""$MediaManagementApiUrl""`,
<<<<<<< HEAD
""mediaManagementApplicationUrl"": { ""ApplicationId"": ""Clientele.MediaManagement"", ""UnityUrl"": ""$MediaManagementApplicationUrl""}, `
""fraudRiskApiUrl"":""$FraudRiskApiUrl""`,
""fraudRiskUnityUrl"": { ""ApplicationId"": ""Clientele.FraudRisk"", ""UnityUrl"": ""$FraudRiskUnityUrl""} `,
""outboundCommunicationApplicationUrl"":""$OutboundCommunicationApiUrl""`,
""outboundCommunicationApiUrl"": { ""ApplicationId"": ""ApplicationId": "Clientele.OutboundCommunication"", ""UnityUrl"": ""$OutboundCommunicationUnityUrl""} `
=======
""mediaManagementApplicationUrl"": { ""ApplicationId"": ""Clientele.MediaManagement"", ""UnityUrl"": ""$MediaManagementApplicationUrl""},`
""qualityAssuranceApiUrl"":""$QualityAssuranceApiUrl""`,
""qualityAssuranceApplicationUrl"": { ""ApplicationId"": ""Clientele.QualityAssurance"", ""UnityUrl"": ""$QualityAssuranceApplicationUrl""}, `
""fraudRiskApiUrl"":""$FraudRiskApiUrl""`,
""fraudRiskUnityUrl"": { ""ApplicationId"": ""Clientele.FraudRisk"", ""UnityUrl"": ""$FraudRiskUnityUrl""} ,`

""outboundCommunicationApiUrl"": ""$OutboundCommunicationApiUrl""`,
""outboundCommunicationApplicationUrl"": { ""ApplicationId"": ""Clientele.OutboundCommunication"", ""UnityUrl"" : ""$OutboundCommunicationUnityUrl"" }`

>>>>>>> b3e9a91f1cf207d1eb3e15ba5d166457c856b0bb
}"