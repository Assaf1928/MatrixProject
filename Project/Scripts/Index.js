
// const variables that contains html elements, I'll use them later in my code.
const input = document.getElementById('search');
const carousel_item = document.getElementById('template');
const gallery_item = document.getElementById('gallery_item');
const carousel_inner = document.getElementById('carousel_inner')
const container = document.getElementById('container')
const loader = document.getElementById('loader')

//I could also use Jquery and write $('#input').on('keyup',function)
//creating a new EventListener, everytime I'll write something inside the input an event will occur
input.addEventListener('keyup', () => {

    //After searching for the first time I'll remove the hidden attributes in order to show the customer the "gallery".
    carousel_inner.removeAttribute('hidden');
    container.removeAttribute('hidden');
    loader.removeAttribute('hidden');
    //storing the user search value inside data var
    let data = input.value;
    //fetch url with the given parameter(data)
    let url = `https://api.github.com/search/repositories?q=${data}`


    //GET REQUEST: will receive the repositories data as a json.
    //triggering the fetch only after 2 seconds to prevent massive amount of requests.
    setTimeout(() => {
        //the fetch request will occur only if there's a data inside the input
        if (data !== '') {


            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {

                    loader.setAttribute('hidden', 'hidden')
           
                    //"slicing" the array into a shorter one(12 length) so the data will load faster.
                    let itemsArray = data.items.slice(0, 12);
                    //var isFirst purpose is to indicate which item will appear first by adding the styling class 'active'
                    let isFirst = true;

                    //removing the previous data before appending the new one.
                    carousel_inner.innerHTML = '';
                    carousel_inner.appendChild(carousel_item)

                    //looping the data
                    itemsArray.forEach((element, index) => {
                        //cloning each hidden variable and changing it's body, we'll remove theirs hidden attribute later and append them to the html.
                        //I could instead create the needed elements but using a template is the faster way.
                        let temp_gallery_item = gallery_item.cloneNode(true);
                        let temp_carousel_item = carousel_item.cloneNode(true);


                        temp_carousel_item.classList.add('item');

                        //as i mentioned before active class will let us know which item in the carousel will appear first
                        if (isFirst) {
                            temp_carousel_item.classList.add('active');
                            isFirst = false;
                        }

                        //by using the template, appending the data into the html.
                        temp_carousel_item.removeAttribute('hidden')
                        temp_gallery_item.removeAttribute('hidden')
                        temp_gallery_item.querySelector('.gallery_item_avatar').innerHTML = `<img src=${element.owner.avatar_url}/>`;
                        temp_gallery_item.querySelector('.item_data p').innerHTML = element.name;
                        let button = temp_gallery_item.querySelector('.item_data button');
                        // adding an event listener to each button with its specific parameters.
                        //this will let the customer abillity to book the repostories.
                        button.addEventListener('click', () => book({ Id: element.id, Name: element.name, Avatar: element.owner.avatar_url }))

                        temp_carousel_item.appendChild(temp_gallery_item)
                        carousel_inner.appendChild(temp_carousel_item);
                    })
                })
                .catch((error) => {

                    console.error('Error:', error);
                });
        }
        else {
            loader.setAttribute('hidden','hidden');

        }
        })

    }, 2000); 




//this method called everytime we click the 'book' button
//the method will send the relevant data to the server and save it in a session
//the method will return true or false
// true if the rep is saved in the session successfully and false if the rep is already booked and saved in the session.

function book(rep) {
    //preparing/orginazing the data before sending it to the server
    var data_object = { Id: rep.Id, Name: rep.Name, Avatar: rep.Avatar };
    fetch('../Home/Book', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({ data: data_object }),
    })
        .then(res => res.text())          // convert to plain text
        .then(text => {
            //showing the customer the method result.
            if (text === "False")
                alert("rep already booked");
            else alert("booked succesfully")
        })  // then log it out
        .catch((error) => {
            console.log(error);
        });

};
