export const awsConfig = {
    Auth: {
      Cognito: {
        userPoolId: 'REPLACE_WITH_USER_POOL_ID',
        userPoolClientId: 'REPLACE_WITH_APP_CLIENT_ID',
        region: 'ap-south-1'
      }
    },
    API: {
      REST: {
        ProductAPI: {
          endpoint: 'REPLACE_WITH_API_GATEWAY_URL',
          region: 'ap-south-1'
        }
      }
    }
  };