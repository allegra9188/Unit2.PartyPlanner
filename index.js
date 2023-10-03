const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-fsa-et-web-ft-sf/events`;

const state = {
  events: [],
};

const eventList = document.querySelector(`#events`);

const addEventForm = document.querySelector(`#addEvent`);
addEventForm.addEventListener("submit", addEvent);



async function render() {
    await getEvents();
    renderEvents();
  }
  render();



async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (err) {
    console.log(err);
  }
}


function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = `<li>No events found.</li>`;
    return;
  }
  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p>${event.date}</p>
        <p>${event.location}</p>
        `;

    // We use createElement for the delete button because we need to attach an event listener.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    li.append(deleteButton);
    // the event listener attached to this event's delete button will call the deleteRecipe function with this specific event's id
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return li;
  });
  eventList.replaceChildren(...eventCards);
}


async function createEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ name, description, date, location 
            // name: addEventForm.name.value,
            // description: addEventForm.description.value,
            // date: addEventForm.date.value,
            // location: addEventForm.location.value,
          }),
        });
        const json = await response.json();

        if (json.error) {
          throw new Error("Failed to create event")
        }
        render();
      }
      catch (error) {
        console.error(error);
      }
}

async function addEvent(event) {
    event.preventDefault();

    await createEvent(
        addEventForm.title.value,
        addEventForm.description.value,
        addEventForm.date.value,
        addEventForm.location.value
    );
    addEventForm.title.value = '';
    addEventForm.description.value = '';
    addEventForm.date.value = '';
    addEventForm.location.value = '';

}


// a function to delete an existing recipe
async function deleteEvent(id) {
    // Notice that we are using fetch to send an API request using the DELETE method to the API URL with /id after it, where `id` is the id of a specific recipe to delete.
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      // we're handling errors a bit differently here, because a successful deletion only sends back a status code.
      if (!response.ok) {
        throw new Error("Event could not be deleted.");
      }
      // re-render the list, since it has changed
      render();
    } catch (error) {
      console.log(error);
    }
  }