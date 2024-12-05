# STORE-MS
`` status: v1 launched `` 

## Summary
  1. Introduction
  2. Instructions
  3. Documentation


## 1. Introduction
- The purpose of this document is to present the payment solution as a microservice for the “desafiobackend” project
- For further information, please consult ``https://github.com/luisfelix-93/desafio-backend``

## 2. Instructions

- This application runs on NestJS framework and uses MongoDB for database.

### 2.1. Installation

```bash
$ npm install
```
### 2.2. Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 3. Documentation
### 3.1 Endpoints
#### a) Bucket
- Endpoints responsible for managing operations related to the “Bucket” (shopping cart).
##### GET *AddProductToBucket*
- This endpoint adds a product to a specific client's bucket
###### Request
```
{{URL_STORE}}/bucket/client/{{CLIENT_ID}}/product/{{PRODUCT_ID}}

 ```
###### Path Parameters

- `CLIENT_ID` (string) - The ID of the client
    
- `PRODUCT_ID` (string) - The ID of the product

###### Response

- Status: 200
    
- Content-Type: application/json

``` json
{
    "client": {
        "type": "object",
        "properties": {
            "client_name": {
                "type": "string"
            },
            "zipCode": {
                "type": "string"
            }
        }
    },
    "productList": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "price": {
                    "type": "number"
                },
                "title": {
                    "type": "string"
                }
            }
        }
    },
    "totalPrice": {
        "type": "number"
    }
}

 ```

##### GET *GetBucketList*
- This endpoint retrieves the details of a specific client's bucket from the store.

###### Request

``{{URL_STORE}}/bucket/client/{{CLIENT_ID}}``

- `CLIENT_ID` (path parameter) : The unique identifier of the client.
    
###### Response

The response will include the details of the client's bucket, such as the bucket name, size, and other relevant information.

``` json
{
    "client": {
        "type": "object",
        "properties": {
            "client_name": {
                "type": "string"
            },
            "zipCode": {
                "type": "string"
            }
        }
    },
    "productList": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "price": {
                    "type": "number"
                },
                "title": {
                    "type": "string"
                }
            }
        }
    },
    "totalPrice": {
        "type": "number"
    }
}

 ```
##### DELETE *ClearBucket*
- This endpoint is used to delete a specific bucket for a client.

###### Request

``{{URL_STORE}}/bucket/client/{{CLIENT_ID}}``

- `CLIENT_ID` (path parameter) : The unique identifier of the client.

#### b) Payments
- These endpoints handle payment management.
##### POST *Buy*
- This endpoint allows the client to make a payment for a purchase.

###### Request
``{{URL_STORE}}/payment/buy/{{CLIENT_ID}}``

- `CLIENT_ID` (string, required): The ID of the client for whom the payment history is to be retrieved.
  
- *Request Body*
  - `paymentType` (string) - The type of payment for the purchase.
    
  - `nmHolder` (string) - The name of the cardholder.
    
  - `cardSerial` (string) - The serial number of the card.
    
  - `ccv` (string) - The CCV code of the card.
    
  - `dateValid` (string) - The expiration date of the card.

- Example
``` json
{
    "paymentType": "{{PAYMENT_TYPE}}",
    "nmHolder": "{{NM_HOLDER}}",
    "cardSerial": "{{CARD_SERIAL}}",
    "ccv": "{{NU_CCV}}",
    "dateValid": "{{DT_VALID}}"
}
```
###### Response
```json
{
    "type": "object",
    "properties": {
        "clientId": {"type": "string"},
        "productList": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "object",
                    "properties": {
                        "client_name": {"type": "string"},
                        "zipCode": {"type": "string"},
                        "_id": {"type": "string"}
                    }
                },
                "productList": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "price": {"type": "number"},
                            "title": {"type": "string"}
                        }
                    }
                },
                "totalPrice": {"type": "number"},
                "_id": {"type": "string"}
            }
        },
        "paymentType": {"type": "string"},
        "nmHolder": {"type": "string"},
        "cardSerial": {"type": "string"},
        "ccv": {"type": "string"},
        "dateValid": {"type": "string"},
        "dateTransaction": {"type": "string"},
        "_id": {"type": "string"},
        "__v": {"type": "number"}
    }
}

 ```

##### GET *History*
- This endpoint retrieves the payment history for a specific client.
###### Request

``{{URL_STORE}}/payment/history/{{CLIENT_ID}}``

- `CLIENT_ID` (string, required): The ID of the client for whom the payment history is to be retrieved.

###### Response
The response will be a JSON array containing objects with the following properties:

- `_id` (string): The ID of the payment history entry.
    
- `clientId` (string): The ID of the client.
    
- `productList` (object): Details of the products purchased, including client information, product list, and total price.
    
    - `client` (object): Information about the client, including name, zip code, and ID.
        
    - `productList` (array): List of products purchased, including price and title.
        
    - `totalPrice` (number): The total price of the products purchased.
        
    - `_id` (string): The ID of the product list entry.
        
- `paymentType` (string): The type of payment.
    
- `nmHolder` (string): Name of the cardholder.
    
- `cardSerial` (string): Serial number of the card.
    
- `ccv` (string): Card verification code.
    
- `dateValid` (string): Expiry date of the card.
    
- `dateTransaction` (string): Date of the transaction.
    
- `__v` (number): Version of the entry.

###### Example

``` json
[
  {
    "_id": "",
    "clientId": "",
    "productList": {
      "client": {
        "client_name": "",
        "zipCode": "",
        "_id": ""
      },
      "productList": [
        {
          "price": 0,
          "title": ""
        }
      ],
      "totalPrice": 0,
      "_id": ""
    },
    "paymentType": "",
    "nmHolder": "",
    "cardSerial": "",
    "ccv": "",
    "dateValid": "",
    "dateTransaction": "",
    "__v": 0
  }
]

 ```
