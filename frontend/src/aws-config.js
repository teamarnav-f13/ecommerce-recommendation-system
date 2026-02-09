export const awsConfig = {
    Auth: {
      Cognito: {
        userPoolId: 'ap-south-1_d5hl5fAmI',
        userPoolClientId: 'ct9708h4u54tme1o1kq2o5rbe',
        region: 'ap-south-1'
      }
    },
    API: {
      REST: {
        ProductAPI: {
          endpoint: 'https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod',
          region: 'ap-south-1'
        }
      }
    }
  };
