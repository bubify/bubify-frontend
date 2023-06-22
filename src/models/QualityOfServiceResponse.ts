export interface QualityOfServiceResponse {
  helpRequestsPending: number;
  helpRequestsPickupTime: number;
  helpRequestsRoundtripTime: number;
  demonstrationsPending: number;
  demonstrationsPickupTime: number;
  demonstrationsRoundtripTime: number;
  procentEverLoggedIn?: number;
  procentLoggedInLastTwoWeeks?: number;
}
