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
$SoftiDocGatewayUnityUrl = $OctopusSoftiDocGatewayUnityUrl
$SoftiDocGatewayApiUrl = $OctopusSoftiDocGatewayApiUrl
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
$OutboundCommunicationApiUrl = $OctopusOutboundCommunicationApiUrl
$OutboundCommunicationUnityUrl = $OctopusOutboundCommunicationUnityUrl
$QualityAssuranceApplicationUrl= $OctopusQualityAssuranceApplicationUrl
$QualityAssuranceApiUrl= $OctopusQualityAssuranceApiUrl


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
""encashmentsUnityUrl"": { ""ApplicationId"": ""SoftiDoc.Encashments"", ""UnityUrl"": ""$encashmentsUnityUrl""}, `
""policyUnityUrl"": { ""ApplicationId"": ""SoftiDoc.Policy"", ""UnityUrl"": ""$policyUnityUrl""}, `
""identityMaintenanceUnityUrl"": { ""ApplicationId"": ""SoftiDoc.IdentityMaintenance"", ""UnityUrl"": ""$identityMaintenanceUnityUrl""}, `
""investmentsIntegrationUrl"": { ""ApplicationId"": ""SoftiDoc.Investments"", ""UnityUrl"": ""$investmentsIntegrationUrl""}, `
""outboundSmsUnityUrl"": { ""ApplicationId"": ""SoftiDoc.OutboundSms"", ""UnityUrl"": ""$outboundSmsUnityUrl""}, `
""outboundSmsApiUrl"":""$outboundSmsApiUrl"",`
""venueIntegrationLocationUrl"": { ""ApplicationId"": ""SoftiDoc.VenueLocation"", ""UnityUrl"": ""$presentationVenueUnityUrl"" }, `
""applicationFormSearchIntegrationUrl"": { ""ApplicationId"": ""SoftiDoc.Search.SearchService"", ""UnityUrl"": ""$applicationFormSearchUnityUrl"" }, `
""applicationFormsCapturePresentationUrl"": { ""ApplicationId"": ""SoftiDoc.ApplicationFormsCapture"", ""UnityUrl"": ""$applicationFormCapturePresentationUrl"" }, `
""communicationUnityUrl"": { ""ApplicationId"": ""SoftiDoc.Communication"", ""UnityUrl"": ""$communicationUnityUrl""}, `
""emsUnityUrl"": { ""ApplicationId"": ""EMS"", ""UnityUrl"": ""$emsUnityUrl""}, `
""emsApiUrl"":""$emsApiUrl"",`
""trainingUnityUrl"": { ""ApplicationId"": ""SoftiDoc.Training"", ""UnityUrl"": ""$trainingUnityUrl""}, `
""trainingApiUrl"":""$trainingApiUrl"",`
""financeUnityUrl"": { ""ApplicationId"": ""SoftiDoc.Finance"", ""UnityUrl"": ""$financeUnityUrl""}, `
""financeApiUrl"":""$financeApiUrl"",`
""financeWorkflowApiUrl"":""$financeWorkflowApiUrl"",`
""ocrRecordIndexerApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.OcrRecordIndexer"", ""UnityUrl"": ""$OcrRecordIndexerApplicationUrl""}, `
""recordIndexerApiUrl"":""$RecordIndexerApiUrl"",`
""BuildNumber"" : ""$buildNumber"",`
""SoftiDocGatewayUnityUrl"": { ""ApplicationId"": ""SoftiDoc.SoftiDocGateway"", ""UnityUrl"": ""$SoftiDocGatewayUnityUrl""},`
""SoftiDocGatewayApiUrl"":""$SoftiDocGatewayApiUrl"",`
""bankValidationUnityUrl"": { ""ApplicationId"": ""SoftiDoc.BankAccountValidation"", ""UnityUrl"": ""$BankValUrl""}, `
""bankAccountValidationApiUrl"":""$BankValApiUrl"", `
""documentDigitizerApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.DocumentDigitizer"", ""UnityUrl"": ""$DocumentDigitizerUnityUrl"" },
""documentDigitizerApiUrl"": ""$DocumentDigitizerApiUrl"", `
""policyAdministrationApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.PolicyAdministration"", ""UnityUrl"": ""$PolicyAdministrationApplicationUrl"" }, `
""policyAdministrationApiUrl"": ""$PolicyAdministrationApiUrl"",`
""SoftiDocClaimsApiUrl"": ""$ClaimsApiUrl"",`
""SoftiDocClaimsUnityUrl"": { ""ApplicationId"": ""SoftiDoc.LifeClaims"", ""UnityUrl"": ""$ClaimsApplicationUrl"", ""CacheFlushUrl"": ""$ClaimsCacheFlushUrl"" }, `
""attendanceRegisterUrl"": { ""ApplicationId"": ""SoftiDoc.AttendanceRegisters"", ""UnityUrl"": ""$AttendanceRegistersApplicationUrl"" }, `
""attendanceRegisterApiUrl"": ""$AttendanceRegisterApiUrl""`,
""supplierUnityUrl"": { ""ApplicationId"": ""Suppliers"", ""UnityUrl"": ""$supplierUnityUrl""}, `
""supplierApiUrl"":""$supplierApiUrl""`,
""gsdApiUrl"":""$GsdApiUrl""`,
""gsdAdminUnityUrl"": { ""ApplicationId"": ""SoftiDoc.GsdAdmin"", ""UnityUrl"": ""$GsdAdminUnityUrl""}, `
""mediaManagementApiUrl"":""$MediaManagementApiUrl""`,
""mediaManagementApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.MediaManagement"", ""UnityUrl"": ""$MediaManagementApplicationUrl""},`
""qualityAssuranceApiUrl"":""$QualityAssuranceApiUrl""`,
""qualityAssuranceApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.QualityAssurance"", ""UnityUrl"": ""$QualityAssuranceApplicationUrl""}, `
""fraudRiskApiUrl"":""$FraudRiskApiUrl""`,
""fraudRiskUnityUrl"": { ""ApplicationId"": ""SoftiDoc.FraudRisk"", ""UnityUrl"": ""$FraudRiskUnityUrl""} ,`
""outboundCommunicationApiUrl"": ""$OutboundCommunicationApiUrl""`,
""outboundCommunicationApplicationUrl"": { ""ApplicationId"": ""SoftiDoc.OutboundCommunication"", ""UnityUrl"" : ""$OutboundCommunicationUnityUrl"" }`


}"