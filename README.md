The payload attribute of the workday API will look like the following
{
	associateID: "" //Required
	format: "" //Required
}

Seth from his side will handle the appending of a leading zero if required.


We need to submit a subscription request to the existing Kong API so that we can receive responses from Workday. Seth will then add another operation to that existing API and coordinate with the Hawkeye team to set up the API we require.


We will receive a valid response for all active employees. In the case of terminated employees or if the associateId passed to Workday doesn't exist, the response attribute fields will be empty.


EC will have a circuit breaker in place in case of Workday API failure. In that scenario, we will bypass this check and allow associates to process the credit application.

Seth will retrieve information about P99 and P95 details from Kong. If the maximum response time exceeds 3 seconds, we will timeout the API and allow associates to process the credit application.

We will have all the required APIs available in lower environments by Q2.

Currently, the credit app is making 75k requests per week, but Workday only allows a maximum of 35k requests within a 24-hour period. Seth will discuss with the respective team and inform us if we need to consider changing the type of API.



Seth is currently working on the API, and it is expected to be completed and available in the lower environment in Kong Gateway by the end of Q1. Following that, the Identity team will begin working on the feature starting from Q2.

The EC product team will review the feature and develop the necessary UI mockups for error scenarios.





