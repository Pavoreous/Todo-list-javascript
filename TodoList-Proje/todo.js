//Tüm elementleri seçme
const form = document.querySelector(".todo-form");
const todoInput = document.querySelector('#todo');
const todoList = document.querySelector(".list-group");
const firstcardbody = document.querySelectorAll(".card-body")[0];
const secondcardboddy = document.querySelectorAll('.card-body')[1];
const filtre = document.querySelector("#filtre");
const clearbutton = document.querySelector("#clear-todos");
const addbutton = document.querySelector("#add-todos");

eventListeners();

function eventListeners() {//Tüm eventListenerlar burdan seçilecek 

    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAlltodosUI);
    // secondcardboddy.eventListeners("click",deleteTodo); //silme işlemini iconu koyarken hallettim
    filtre.addEventListener("keyup", filterTodos);
    clearbutton.addEventListener( "click" , clearAllTodos) ;
}

// function deleteTodo(e){//eğer ben arayüzdeki listedeki x iconuna en başta click olayı koymasam bu kod ile de silme işlemmi yapılabilirdi click olayı bu ama ben onclick ile zaten en başta onlara fonksiyon koydum 
//    if(e.target.className==="fa fa-remove"){
//     e.target.parentElement.parentElement.remove();
//    }
// }


function clearAllTodos(e){
if(confirm('Tümünü Silmek İstediğinize Emin misiniz?')){
    // todoList.innerHTML="";//yavaş yöntemde olan removeChild ve appendchild metotlarını kullanmadan bu şekilde de silmemiz


    // while(todoList.firstElementChild!=null){
    //     todoList.removeChild(todoList.firstElementChild);//null olana kadar silmeye devam et innerhtml den daha hızlı
    // }

    localStorage.removeItem("todos");
    todoList.innerHTML= "";
}
}


function filterTodos(e) {


    const filtrevalue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filtrevalue) != -1) {
            listItem.setAttribute("style", "display:block  !important ; margin:1.5rem;");
        } else {
            listItem.setAttribute("style", "display:none  !important ; margin:1.5rem;");  //!important boostrapt özelliğini bastırıyo bu olmadan yapamıyoz bunu iyi hatırla boostrap birşeyleri kolaylaştırsada sen yazmadığın için herşeyi kontrol edemiyon bu kod özellik bastırmaya yarar
        }
    })
}

function deleteTodoFromStorage(todo) {//localstorage den silme işlemi 
    let todos = getTodosFromStorage();

    todos.forEach(function (todoK, index) {
        if (todoK === todo) {
            todos.splice(index, 1);//Arayden değer silme işlemini yaptık 
        }

    });

    localStorage.setItem("todos", JSON.stringify(todos));
}



function loadAlltodosUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo)
    })
}


function addTodo(e) {
    const newtodo = todoInput.value.trim();   //trim() baştaki ve sondaki boşlkları siler

    if (newtodo === "") {

        // <div class="alert alert-danger" role="alert">
        //     A simple danger alert—check it out!
        // </div>
        showAlert("danger", "Lütfen Bir Todo Girin...");
    }
    else {
        addTodoToUI(newtodo);
        addTodoToStorage(newtodo);
        showAlert("success", newtodo + " Başarıyla Eklendi...");
    }




    e.preventDefault();
}



function getTodosFromStorage() {//storage dan bütün todo ları alır
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos;
}



function addTodoToStorage(newtodo) {
    let todos = getTodosFromStorage();

    todos.push(newtodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}



function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstcardbody.appendChild(alert);

    //setTimeout fonksiyonu ile zaman tutabiliriz ama ben interval kullandım kademeli soluklaşma işlemi için

    let opacity = 1; // Başlangıç opacity değeri
    const interval = setInterval(function () {
        if (opacity > 0) {
            alert.style.opacity = opacity;
            opacity -= 0.05; // Her adımda opacity değerini azaltıyoruz
        } else {
            clearInterval(interval); // Interval'ı durduruyoruz
            alert.remove(); // Alert elementini kaldırıyoruz
        }
    }, 150); // Her adımda 150ms bekliyoruz
}



function addTodoToUI(newtodo) {//string değerini uı a ekleyecek

    const listItem = document.createElement("li");//ul içine li oluşturduk
    listItem.className = "list-group-item d-flex justify-content-between"
    listItem.style.margin = "1.5rem";
    const link = document.createElement("a");//linki olusturduk
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";//fontawesome kullanıldı

    link.style.float = "right";// bu kod arama kısmın da liste olayında x işareti sola kayıp metinle birleşiyor onu engellemek için 
 
    //text node ekleme
    listItem.appendChild(document.createTextNode(newtodo));//metin eklendiartık şimdi a etiketi eklenecek
    listItem.appendChild(link);//x ikon 

    //todo liste ekleme 
    todoList.appendChild(listItem);


    //input temizleme
    todoInput.value = "";

    //todo listen tek tek silme
    //ARROW Function kullanımı aşağıda
    link.onclick = (e) => deleteTodo(e, listItem)//bu sayede her x butonuna tık 


}



function deleteTodo(e, item) {

    todoList.removeChild(item);
    if (e.target.className === "fa fa-remove") {
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    }

    e.preventDefault();
}