function getRegisterModal(triggerId, userInfo) {
  const modal = {
    trigger_id: triggerId,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Register",
      },
      submit: {
        type: "plain_text",
        text: "Submit",
      },
      callback_id: "add-user",
      blocks: [
        {
          type: "input",
          block_id: "first_name",
          element: {
            type: "plain_text_input",
            action_id: "first_name",
            placeholder: {
              type: "plain_text",
              text: "First name",
            },
          },
          label: {
            type: "plain_text",
            text: "First name",
          },
        },
        {
          type: "input",
          block_id: "last_name",
          element: {
            type: "plain_text_input",
            action_id: "last_name",
            placeholder: {
              type: "plain_text",
              text: "Last name",
            },
          },
          label: {
            type: "plain_text",
            text: "Last name",
          },
        },
        {
          type: "input",
          block_id: "email",
          element: {
            type: "plain_text_input",
            action_id: "email",
            placeholder: {
              type: "plain_text",
              text: `${userInfo.user.profile.email}`,
            },
          },
          label: {
            type: "plain_text",
            text: "Email",
          },
          hint: {
            type: "plain_text",
            text: "Your Email account",
          },
        },
        {
          type: "input",
          block_id: "password",
          element: {
            type: "plain_text_input",
            placeholder: {
              type: "plain_text",
              text: "Password",
            },
            action_id: "password",
          },
          label: {
            type: "plain_text",
            text: "Password",
          },
          hint: {
            type: "plain_text",
            text: "Your password will be encrypted (secure)",
          },
        },
        {
          block_id: "channel",
          type: "input",
          label: {
            type: "plain_text",
            text: "Select a channel to post the result on",
          },
          element: {
            action_id: "channel",
            type: "conversations_select",
            response_url_enabled: true,
          },
        },
      ],
    },
  };
  return modal;
}

module.exports = getRegisterModal;
