# API-Polaku

## **User Route**

- **Signup**
  - URL:
    - `POST /users/signup`
  - Body:
    - `username`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
    - `email`: `String`, required
    - `role_id`: `String`, 
    - `avatar`: `File/Image`, 
    - `fullname`: `String`, required
    - `initial`: `String`, required
    - `nik`: `String`, required
    - `address`: `String`, required
    - `date_of_birth`: `Date`, required
    - `leave`: `String`, required
    - `building_id`: `String`, required
    - `company_id`: `String`, required
    - `designations_id`: `String`, required
    - `phone`: `Integer`, required
    - `name_evaluator_1`: `String`, required
    - `name_evaluator_2`: `String`, 
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "user_id": "...",
            "username": "...",
            "email": "...",
            "password": "<HashedPassword>",
            "email": "testing@email.com",
            "role_id": "...",
            "activated": "...",
            "flag_password": "...",
            "tbl_account_detail": {
                "account_details_id": "...",
                "user_id": "...",
                "fullname": "...",
                "phone": "...",
                "avatar": "...",
                "company_id": "...",
                "location_id": "...",
                "building_id": "...",
                "designations_id": "...",
                "position_id": "...",
                "leave": "...",
                "admin_contact_categori": "...",
                "name_evaluator_1": "...",
                "name_evaluator_2": "..."
            }
          }
        }
      ```
    - Error (status: `400, 500`)

- **Signin**
  - URL:
    - `POST /users/signin`
  - Body:
    - `username`: `String`, required
    - `password`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "token": "<Token>",
          "username": "...",
          "user_id": "...",
          "role_id": "...",
          "status": "...",
          "position": "...",
          "sisaCuti": "...",
          "isRoomMaster": "...",
          "isCreatorMaster": "...",
          "isCreatorAssistant": "...",
          "adminContactCategori": "..."
        }
      ```
    - Error (status: `400, 500`)

- **List Users**
  - URL:
    - `GET /users`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "user_id": "...",
              "username": "...",
              "password": "<HashedPassword>",
              "email": "...",
              "role_id": "...",
              "activated": "...",
              "flag_password": "...",
              "tbl_account_detail": {
                  "account_details_id": "...",
                  "user_id": "...",
                  "fullname": "...",
                  "phone": "...",
                  "avatar": "...",
                  "company_id": "...",
                  "location_id": "...",
                  "building_id": "...",
                  "designations_id": "...",
                  "position_id": "...",
                  "leave": "...",
                  "admin_contact_categori": "...",
                  "name_evaluator_1": "...",
                  "name_evaluator_2": "..."
              }
            }
          ]
        }
      ```
    - Error (status: `500`)

- **Change Password**
  - URL:
    - `PUT /users/changePassword`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `password`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "user_id": "...",
            "username": "...",
            "password": "<HashedPassword>",
            "email": "...",
            "role": "...",
            "activated": "...",
            "flag_password": "...",
          }
        }
      ```
    - Error (status: `400, 500`)

- **Check Token**
  - URL:
    - `GET /users/checktoken`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "status": "...",
            "username": "...",
            "user_id": "...",
            "role_id": "...",
            "isRoomMaster": "...",
            "isCreatorMaster": "...",
            "isCreatorAssistant": "...",
            "position": "...",
            "sisaCuti": "...",
            "adminContactCategori": "...",
            "evaluator1": {
                "idEvaluator1": "...",
                "name": "..."
            }, (OPTIONAL)
            "evaluator2": {
                "idEvaluator2 ": "...",
                "name": "..."
            } (OPTIONAL)
          }
        }
      ```
    - Error (status: `400, 500`)

- **Activation Account**
  - URL:
    - `PUT /users/activationAccount`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `passwordLama`: `String`, required
    - `passwordBaru`: `String`, required
    - `email`: `String`, required
    - `noHP`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "user_id": "...",
            "username": "...",
            "password": "<HashedPassword>",
            "email": "...",
            "role_id": "...",
            "activated": "...",
            "flag_password": "..."
          }
        }
      ```
    - Error (status: `400, 500`)

- **Edit Profil**
  - URL:
    - `PUT /users/editProfil`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `fullname`: `String`, required
    - `username`: `String`, required
    - `email`: `String`, required
    - `noHP`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "user_id": "...",
              "username": "...",
              "password": "<HashedPassword>",
              "email": "...",
              "role_id": "...",
              "activated": "...",
              "flag_password": "...",
              "tbl_account_detail": {
                  "account_details_id": "...",
                  "user_id": "...",
                  "fullname": "...",
                  "phone": "...",
                  "avatar": "...",
                  "company_id": "...",
                  "location_id": "...",
                  "building_id": "...",
                  "designations_id": "...",
                  "position_id": "...",
                  "leave": "...",
                  "admin_contact_categori": "...",
                  "name_evaluator_1": "...",
                  "name_evaluator_2": "..."
              }
            }
        }
      ```
    - Error (status: `400, 500`)

- **Change Avatar**
  - URL:
    - `PUT /users/changeAvatar`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `avatar`: `File`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "user_id": "...",
              "username": "...",
              "password": "<HashedPassword>",
              "email": "...",
              "role_id": "...",
              "activated": "...",
              "flag_password": "...",
              "tbl_account_detail": {
                  "account_details_id": "...",
                  "user_id": "...",
                  "fullname": "...",
                  "phone": "...",
                  "avatar": "...",
                  "company_id": "...",
                  "location_id": "...",
                  "building_id": "...",
                  "designations_id": "...",
                  "position_id": "...",
                  "leave": "...",
                  "admin_contact_categori": "...",
                  "name_evaluator_1": "...",
                  "name_evaluator_2": "..."
              }
            }
        }
      ```
    - Error (status: `400, 500`)

<br>
//

## **Announcement Route**

- **Create Announcement**
  - URL:
    - `POST /announcement`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `title`: `String`, required
    - `description`: `String`, required
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `attachment`: `File`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "announcements_id": null,
            "title": "...",
            "description": "...",
            "user_id": "...",
            "attachment": "...",
            "start_date": "...",
            "end_date": "...",
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **List Announcements**
  - URL:
    - `GET /announcement`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "announcements_id": "...",
              "title": "...",
              "description": "...",
              "user_id": "...",
              "status": "...",
              "view_status": "...",
              "start_date": "...",
              "end_date": "...",
              "all_client": "...",
              "attachment": "...",
              "thumbnail": "..."
            }
          ]
        }
      ```
    - Error (status: `500`)

- **Get A Announcement**
  - URL:
    - `GET /announcement/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "announcements_id": "...",
              "title": "...",
              "description": "...",
              "user_id": "...",
              "status": "...",
              "view_status": "...",
              "start_date": "...",
              "end_date": "...",
              "all_client": "...",
              "attachment": "...",
              "thumbnail": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Announcement**
  - URL:
    - `DELETE /announcement/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)

- **Update A Announcement**
  - URL:
    - `PUT /announcement/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `title`: `String`, required
    - `description`: `String`, required
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `attachment`: `File`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "announcements_id": "...",
            "title": "...",
            "description": "...",
            "user_id": "...",
            "attachment": "...",
            "start_date": "...",
            "end_date": "...",
          }
        }
      ```
    - Error (status: `400, 401, 500`)





<br>

## **News Route**

- **Create News**
  - URL:
    - `POST /news`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `title`: `String`, required
    - `description`: `String`, required
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `attachments`: `File`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "polanews_id": null,
            "title": "...",
            "description": "...",
            "user_id": "...",
            "attachments": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **List News**
  - URL:
    - `GET /news`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "polanews_id": "...",
              "title": "...",
              "description": "...",
              "attachment": "...",
              "thumbnail": "...",
              "status": "...",
              "total_view": "...",
              "user_id": "...",
              "created_at": "..."
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Get A News**
  - URL:
    - `GET /news`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "polanews_id": "...",
              "title": "...",
              "description": "...",
              "attachment": "...",
              "thumbnail": "...",
              "status": "...",
              "total_view": "...",
              "user_id": "...",
              "created_at": "..."
            }
        }
      ```
    - Error (status: `400, 401, 500`)


- **Delete A News**
  - URL:
    - `DELETE /news/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)

- **Update A News**
  - URL:
    - `PUT /news/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `title`: `String`, required
    - `description`: `String`, required
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `attachments`: `File`
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "polanews_id": "...",
            "title": "...",
            "description": "...",
            "user_id": "...",
            "attachments": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

<br>

## **Event Route**

- **Create Event**
  - URL:
    - `POST /event`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `event_name`: `String`, required
    - `description`: `String`, required
    - `start_date`: `Date`, required
    - `end_date`: `Date`, required
    - `location`: `String`, required
    - `thumbnail`: `File`, required
    - `option`: `String`, required
    - `invited`: `Array of String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "event_id": null,
            "event_name": "...",
            "description": "...",
            "start_date": "...",
            "end_date": "...",
            "location": "...",
            "color": "...",
            "status": 0,
            "thumbnail": "...",
            "user_id": "...",
            "created_at": "...",
            "keterangan": "...",
            "room_booking_id": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **List All Event (Only Approve Event)**
  - URL:
    - `GET /event`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "event_id": "...",
              "event_name": "...",
              "description": "...",
              "start_date": "...",
              "end_date": "...",
              "location": "...",
              "color": null,
              "status": 1,
              "thumbnail": "...",
              "user_id": "...",
              "created_at": "...",
              "keterangan": "...",
              "room_booking_id": "...",
              "tbl_users": [
                  {
                      "user_id": "...",
                      "username": "...",
                      "password": "...",
                      "email": "...",
                      "role_id": "...",
                      "activated": "...",
                      "flag_password": "...",
                      "tbl_event_responses": {
                          "event_response_id": "...",
                          "event_id": "...",
                          "user_id": "...",
                          "response": "...",
                          "creator": "...",
                          "created_at": "..."
                      },
                      "tbl_account_detail": {
                          "account_details_id": "...",
                          "user_id": "...",
                          "fullname": "...",
                          "phone": "...",
                          "avatar": "...",
                          "company_id": "...",
                          "location_id": "...",
                          "building_id": "...",
                          "designations_id": "...",
                          "position_id": "...",
                          "leave": "...",
                          "admin_contact_categori":"...",
                          "name_evaluator_1": "...",
                          "name_evaluator_2": "..."
                      }
                  }
              ],
              "tbl_event_invites": [
                  {
                      "event_invite_id": "...",
                      "event_id": "...",
                      "option": "...",
                      "company_id": "...",
                      "departments_id": "...",
                      "user_id": "...",
                      "created_at": "..."
                  }
              ]
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **List All Event**
  - URL:
    - `GET /event/all`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "event_id": "...",
              "event_name": "...",
              "description": "...",
              "start_date": "...",
              "end_date": "...",
              "location": "...",
              "color": null,
              "status": 1,
              "thumbnail": "...",
              "user_id": "...",
              "created_at": "...",
              "keterangan": "...",
              "room_booking_id": "...",
              "tbl_users": [
                  {
                      "user_id": "...",
                      "username": "...",
                      "password": "...",
                      "email": "...",
                      "role_id": "...",
                      "activated": "...",
                      "flag_password": "...",
                      "tbl_event_responses": {
                          "event_response_id": "...",
                          "event_id": "...",
                          "user_id": "...",
                          "response": "...",
                          "creator": "...",
                          "created_at": "..."
                      },
                      "tbl_account_detail": {
                          "account_details_id": "...",
                          "user_id": "...",
                          "fullname": "...",
                          "phone": "...",
                          "avatar": "...",
                          "company_id": "...",
                          "location_id": "...",
                          "building_id": "...",
                          "designations_id": "...",
                          "position_id": "...",
                          "leave": "...",
                          "admin_contact_categori":"...",
                          "name_evaluator_1": "...",
                          "name_evaluator_2": "..."
                      }
                  }
              ],
              "tbl_event_invites": [
                  {
                      "event_invite_id": "...",
                      "event_id": "...",
                      "option": "...",
                      "company_id": "...",
                      "departments_id": "...",
                      "user_id": "...",
                      "created_at": "..."
                  }
              ]
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **List All My Event**
  - URL:
    - `GET /event/myevents`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "event_id": "...",
              "event_name": "...",
              "description": "...",
              "start_date": "...",
              "end_date": "...",
              "location": "...",
              "color": null,
              "status": 1,
              "thumbnail": "...",
              "user_id": "...",
              "created_at": "...",
              "keterangan": "...",
              "room_booking_id": "...",
              "tbl_users": [
                  {
                      "user_id": "...",
                      "username": "...",
                      "password": "...",
                      "email": "...",
                      "role_id": "...",
                      "activated": "...",
                      "flag_password": "...",
                      "tbl_event_responses": {
                          "event_response_id": "...",
                          "event_id": "...",
                          "user_id": "...",
                          "response": "...",
                          "creator": "...",
                          "created_at": "..."
                      },
                      "tbl_account_detail": {
                          "account_details_id": "...",
                          "user_id": "...",
                          "fullname": "...",
                          "phone": "...",
                          "avatar": "...",
                          "company_id": "...",
                          "location_id": "...",
                          "building_id": "...",
                          "designations_id": "...",
                          "position_id": "...",
                          "leave": "...",
                          "admin_contact_categori":"...",
                          "name_evaluator_1": "...",
                          "name_evaluator_2": "..."
                      }
                  }
              ],
              "tbl_event_invites": [
                  {
                      "event_invite_id": "...",
                      "event_id": "...",
                      "option": "...",
                      "company_id": "...",
                      "departments_id": "...",
                      "user_id": "...",
                      "created_at": "..."
                  }
              ]
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)


- **Get A Event**
  - URL:
    - `GET /event/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "event_id": "...",
              "event_name": "...",
              "description": "...",
              "start_date": "...",
              "end_date": "...",
              "location": "...",
              "color": null,
              "status": 1,
              "thumbnail": "...",
              "user_id": "...",
              "created_at": "...",
              "keterangan": "...",
              "room_booking_id": "...",
              "tbl_users": [
                  {
                      "user_id": "...",
                      "username": "...",
                      "password": "...",
                      "email": "...",
                      "role_id": "...",
                      "activated": "...",
                      "flag_password": "...",
                      "tbl_event_responses": {
                          "event_response_id": "...",
                          "event_id": "...",
                          "user_id": "...",
                          "response": "...",
                          "creator": "...",
                          "created_at": "..."
                      },
                      "tbl_account_detail": {
                          "account_details_id": "...",
                          "user_id": "...",
                          "fullname": "...",
                          "phone": "...",
                          "avatar": "...",
                          "company_id": "...",
                          "location_id": "...",
                          "building_id": "...",
                          "designations_id": "...",
                          "position_id": "...",
                          "leave": "...",
                          "admin_contact_categori":"...",
                          "name_evaluator_1": "...",
                          "name_evaluator_2": "..."
                      }
                  }
              ],
              "tbl_event_invites": [
                  {
                      "event_invite_id": "...",
                      "event_id": "...",
                      "option": "...",
                      "company_id": "...",
                      "departments_id": "...",
                      "user_id": "...",
                      "created_at": "..."
                  }
              ]
            }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Event**
  - URL:
    - `DELETE /event/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)

- **Update A Event**
  - URL:
    - `PUT /event/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `event_name`: `String`, required
    - `description`: `String`, required
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `location`: `String`, required
    - `thumbnail`: `File`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "event_id": null,
            "event_name": "...",
            "description": "...",
            "startDate": "...",
            "endDate": "...",
            "location": "...",
            "thumbnail": "...",
            "user_id": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Follow A Event**
  - URL:
    - `PUT /event/follow`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `event_id`: `String`, required
    - `response`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "event_id": "...",
            "event_name": "...",
            "description": "...",
            "start_date": "...",
            "end_date": "...",
            "location": "...",
            "color": "...",
            "status": "...",
            "thumbnail": "...",
            "user_id": "...",
            "created_at": "...",
            "keterangan": "...",
            "room_booking_id": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Approve Event**
  - URL:
    - `PUT /event/approvalEvent/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `status`: `Boolean`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "event_id": "...",
            "event_name": "...",
            "description": "...",
            "start_date": "...",
            "end_date": "...",
            "location": "...",
            "color": "...",
            "status": "...",
            "thumbnail": "...",
            "user_id": "...",
            "created_at": "...",
            "keterangan": "...",
            "room_booking_id": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Assign Master Creator**
  - URL:
    - `POST /event/masterCreator`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `user_id`: `String`, required
    - `chief`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "master_creator_id": "...",
            "user_id": "...",
            "chief": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Get All Master Creator**
  - URL:
    - `GET /event/masterCreator`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "master_creator_id": "...",
            "user_id": "...",
            "chief": "...",
            "tbl_user": {
                "user_id": "...",
                "username": "...",
                "password": "...",
                "email": "...",
                "role_id": "...",
                "activated": "...",
                "flag_password": "...",
                "tbl_account_detail": {
                    "account_details_id": "...",
                    "user_id": "...",
                    "fullname": "...",
                    "phone": "...",
                    "avatar": "...",
                    "company_id": "...",
                    "location_id": "...",
                    "building_id": "...",
                    "designations_id": "...",
                    "position_id": "...",
                    "leave": "...",
                    "admin_contact_categori": "...",
                    "name_evaluator_1": "...",
                    "name_evaluator_2": "..."
                }
            },
            "idChief": {
                "user_id": "...",
                "username": "...",
                "password": "...",
                "email": "...",
                "role_id": "...",
                "activated": "...",
                "flag_password": "...",
                "tbl_account_detail": {
                    "account_details_id": "...",
                    "user_id": "...",
                    "fullname": "...",
                    "phone": "...",
                    "avatar": "...",
                    "company_id": "...",
                    "location_id": "...",
                    "building_id": "...",
                    "designations_id": "...",
                    "position_id": "...",
                    "leave": "...",
                    "admin_contact_categori": "...",
                    "name_evaluator_1": "...",
                    "name_evaluator_2": "..."
                }
            }
        }
          }
        }
      ```
    - Error (status: `400, 401, 500`)



- **Delete A Master Creator**
  - URL:
    - `DELETE /events/masterCreator/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


<br>

## **Booking Room Route**

- **Create Booking Room**
  - URL:
    - `POST /bookingRoom`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `room_id`: `Integer`, required
    - `date_in`: `Date`, required
    - `time_in`: `Time`, required
    - `time_out`: `Time`, required
    - `subject`: `String`, required
    - `partisipan`: `Array of String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "room_booking_id": null,
            "room_id": "...",
            "date_in": "...",
            "time_in": "...",
            "time_out": "...",
            "subject": "...",
            "user_id": 913,
            "created_at": "...",
            "count": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **List Booking Room**
  - URL:
    - `GET /bookingRoom`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
              {
                  "room_booking_id": "...",
                  "room_id": "...",
                  "date_in": "...",
                  "time_in": "...",
                  "time_out": "...",
                  "subject": "...",
                  "user_id": "...",
                  "created_at": "...",
                  "count": "...",
                  "tbl_user": {
                      "user_id": "...",
                      "username": "...",
                      "password": "...",
                      "email": "...",
                      "role_id": "...",
                      "activated": "...",
                      "flag_password": "...",
                      "tbl_account_detail": {
                          "account_details_id": "...",
                          "user_id": "...",
                          "fullname": "...",
                          "phone": "...",
                          "avatar": "...",
                          "company_id": "...",
                          "location_id": "...",
                          "building_id": "...",
                          "designations_id": "...",
                          "position_id": "...",
                          "leave": "...",
                          "admin_contact_categori": "...",
                          "name_evaluator_1": "...",
                          "name_evaluator_2": "..."
                      }
                  },
                  "tbl_room": {
                      "room_id": "...",
                      "room": "...",
                      "max": "...",
                      "facilities": "...",
                      "thumbnail": "...",
                      "company_id": "...",
                      "building_id": "...",
                      "location_id": "..."
                  }
              }
          ],
          "eventResponses": [
              [
                  {
                      "event_response_id": "...",
                      "event_id": "...",
                      "user_id": "...",
                      "response": "...",
                      "creator": "...",
                      "created_at": "...",
                      "tbl_user": {
                          "user_id": "...",
                          "username": "...",
                          "password": "...",
                          "email": "...",
                          "role_id": "...",
                          "activated": "...",
                          "flag_password": "...",
                          "tbl_account_detail": {
                              "account_details_id": "...",
                              "user_id": "...",
                              "fullname": "...",
                              "phone": "...",
                              "avatar": "...",
                              "company_id": "...",
                              "location_id": "...",
                              "building_id": "...",
                              "designations_id": "...",
                              "position_id": "...",
                              "leave": "...",
                              "admin_contact_categori": "...",
                              "name_evaluator_1": "...",
                              "name_evaluator_2": "..."
                          }
                      }
                  }
              ]
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Get A Booking Room**
  - URL:
    - `GET /bookingRoom/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "room_booking_id": "...",
              "room_id": "...",
              "date_in": "...",
              "time_in": "...",
              "time_out": "...",
              "subject": "...",
              "user_id": "...",
              "count": "..."
            }
        }
      ```
    - Error (status: `400, 401, 500`)


- **Delete A Booking Room**
  - URL:
    - `DELETE /bookingRoom/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)

- **Update A Booking Room**
  - URL:
    - `PUT /bookingRoom/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `room_id`: `Integer`, required
    - `date_in`: `Date`, required
    - `time_in`: `Time`, required
    - `time_out`: `Time`, required
    - `subject`: `String`, required
    - `count`: `Integer`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "room_booking_id": "...",
            "room_id": "...",
            "date_in": "...",
            "time_in": "...",
            "time_out": "...",
            "subject": "...",
            "count": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

<br>

  
## **Contact Us Route**

- **Create Contact Us**
  - URL:
    - `POST /contactUs`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `message`: `String`, required
    - `contactcategorisId`: `String`, required
    - `company_id`: `Date`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "contact_id": null,
            "name": "...",
            "email": "...",
            "message": "...",
            "contact_categories_id": "...",
            "company_id": "...",
            "user_id": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **List Contact Us**
  - URL:
    - `GET /contactUs`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "contact_id": "...",
              "name": "...",
              "email": "...",
              "message": "...",
              "contact_categories_id": "...",
              "company_id": "...",
              "user_id": "...",
              "status": "..."
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Get A Contact Us**
  - URL:
    - `GET /contactUs/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "contact_id": "...",
              "name": "...",
              "email": "...",
              "message": "...",
              "contact_categories_id": "...",
              "company_id": "...",
              "user_id": "...",
              "status": "..."
            }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Contact Us**
  - URL:
    - `DELETE /contactUs/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Delete Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)

- **Create Contact Us**
  - URL:
    - `POST /contactUs`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `status`: `String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "contact_id": null,
            "name": "...",
            "email": "...",
            "message": "...",
            "contact_categories_id": "...",
            "company_id": "...",
            "user_id": "...",
            "status": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)