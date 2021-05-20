function getBookModal(triggerId) {
  const modal = {
    trigger_id: triggerId,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Add a book",
      },
      submit: {
        type: "plain_text",
        text: "Submit",
      },
      callback_id: "add-book",
      blocks: [
        {
          type: "input",
          block_id: "title",
          element: {
            type: "plain_text_input",
            action_id: "title",
            placeholder: {
              type: "plain_text",
              text: "Book name",
            },
          },
          label: {
            type: "plain_text",
            text: "Title",
          },
        },
        {
          type: "input",
          block_id: "author",
          element: {
            type: "plain_text_input",
            action_id: "author",
            placeholder: {
              type: "plain_text",
              text: "Author name",
            },
          },
          label: {
            type: "plain_text",
            text: "Author",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "cover",
          element: {
            type: "plain_text_input",
            action_id: "cover",
            placeholder: {
              type: "plain_text",
              text: "The URL for the cover",
            },
          },
          label: {
            type: "plain_text",
            text: "Cover image URL",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "abstract",
          element: {
            type: "plain_text_input",
            action_id: "abstract",
            multiline: true,
            placeholder: {
              type: "plain_text",
              text: "..........",
            },
          },
          label: {
            type: "plain_text",
            text: "Abstract",
          },
          hint: {
            type: "plain_text",
            text: "Description of the book",
          },
        },
        {
          type: "input",
          block_id: "publication_date",
          element: {
            type: "datepicker",
            initial_date: "1990-04-28",
            placeholder: {
              type: "plain_text",
              text: "Select the publication date",
              emoji: true,
            },
            action_id: "publication_date",
          },
          label: {
            type: "plain_text",
            text: "Publication date",
            emoji: true,
          },
        },
      ],
    },
  };
  return modal;
}

module.exports = getBookModal;
