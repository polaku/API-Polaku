# API-Polaku

## **User Route**

- **Signup**
  - URL:
    - `POST /users/signup`
  - Body:
    - `username`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "user_id": null,
            "username": "...",
            "email": "...",
            "password": "<HashedPassword>"
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
          "username": "..."
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
              "role": "...",
              "activated": "...",
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
          }
        }
      ```
    - Error (status: `400, 500`)

<br>

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
    - `startDate`: `Date`, required
    - `endDate`: `Date`, required
    - `location`: `String`, required
    - `thumbnail`: `File`, required
  - Expected response :
    - Success (status: `201`)
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

- **List Event**
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
              "startDate": "...",
              "endDate": "...",
              "location": "...",
              "thumbnail": "...",
              "user_id": "..."
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
              "startDate": "...",
              "endDate": "...",
              "location": "...",
              "thumbnail": "...",
              "user_id": "..."
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
    - Success (status: `201`)
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
    - `count`: `Integer`, required
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
              "count": "..."
            }
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
    - `contactCategoriesId`: `String`, required
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