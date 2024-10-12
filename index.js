//lấy obj vừa chọn ra
let itemChoice = null;
document.querySelector(".list").addEventListener("click", event => {
    let list = getList();
    itemChoice = list.find((item) => item.id == event.target.parentElement.parentElement.dataset.id);
});

//Nút Add
document.querySelector("#input-form").addEventListener("submit", event =>{
    event.preventDefault();
    //lấy giá trị
    let name = document.querySelector("#name").value;
    let price = document.querySelector("#price").value;
    let amount = document.querySelector("#amount").value;
    let description = document.querySelector("#description").value;
    //tạo obj chứa
    let item = {
        id: new Date().toISOString(),
        name: name.trim(),
        price: price.trim(),
        amount: amount.trim(),
        description: description.trim(),
    };
    //hiển thị item lên giao diện: addItemToUI(item)
    addItemToUI(item);
    //lưu item vào ls: addItemToLS(item)
    addItemToLS(item);
    //xoá value trong input
    itemChoice = null;
    document.querySelectorAll(".input-item").forEach(item => {
        item.value = "";
    });
});

//getList()
const getList = () => {
    return JSON.parse(localStorage.getItem("list")) || [];
};

//hàm nhận vào 1 item và hiển thị lên ui
const addItemToUI = (item) => {
    let newCard = document.createElement("div");
    newCard.className = "card col-xs-12 col-md-6 col-lg-4";
    newCard.setAttribute("data-id", item.id);
    newCard.innerHTML = `
        <div class="card-img">
            <img src="https://www.anime-oz.com/assets/alt_3/HMR-64620.jpg?20211104222248" />
        </div>
        <div class="card-content d-flex flex-column justify-content-center fs-6">
            <div><span class="ps-3">${item.name}</span></div>
            <div class="d-flex justify-content-around">
                <span>${Number((Number(item.price) / 2).toFixed(0)).toLocaleString('vi')}</span>
                <span class="text-decoration-line-through">${Number(Number(item.price).toFixed(0)).toLocaleString('vi')}</span>
            </div>
        </div>
    `;
    document.querySelector(".list").appendChild(newCard);
};

//hàm nhận item và lưu nó vào trong list trong localStorage
const addItemToLS = (item) => {
    //lấy list từ ls về
    let list = getList();
    //nhét item vào list 
    list.push(item);
    //lưu lên lại ls
    localStorage.setItem("list", JSON.stringify(list));
};

//init: render ra các item trong list
const init = () => {
    //lấy danh sách từ ls
    let list = getList();
    list.forEach((item) => {
        addItemToUI(item);
    });
};
init(); 

//sự kiện xoá 1 item
//xoá
document.querySelector(".btn-remove").addEventListener("click", eventDel => {
    if(itemChoice){
        let isConfirmed = confirm(`Bạn có chắc muốn xoá sản phẩm ${itemChoice.name} không?`);
        if(isConfirmed){
            //xoá trên UI
            let card = document.querySelector(`.card[data-id="${itemChoice.id}"]`);
            card.remove();
            //xoá trên LS
            let idRemove = itemChoice.id;
            removeItemFromLS(idRemove);
        };
    }else{
        alert("Không có gì để xoá!");
    };
    itemChoice = null;
    document.querySelectorAll(".input-item").forEach(item => {
        item.value = "";
    });
});

const removeItemFromLS = (idRemove) => {
    //lấy danh sách
    let list = getList();
    //xoá item có id == idRemove
    list = list.filter((item) => item.id != idRemove);
    //cập nhật danh sách mới vào ls
    localStorage.setItem("list", JSON.stringify(list));
};

//chức năng filter

//filter theo #filter
// document.querySelector("#filter").addEventListener("keyup", event => {
//     let inputValue = event.target.value //lấy giá trị vừa nhập
//     let list = getList(); //lấy list từ ls
//     //filter
//     let filteredList = list.filter((item) => (item.name.includes(inputValue)) || 
//                                              (item.description.includes(inputValue)));
//     //xoá danh sách UI cũ
//     document.querySelector(".list").innerHTML = "";
//     filteredList.forEach((item) => {
//         addItemToUI(item);
//     });
// });

//filter theo .btn-search
document.querySelector(".btn-search").addEventListener("click", event => {
    let inputValue = event.target.previousElementSibling.value //lấy giá trị vừa nhập
    let list = getList(); //lấy list từ ls
    //filter
    let filteredList = list.filter((item) => (item.name.includes(inputValue)) || 
                                            (item.description.includes(inputValue)));
    //xoá danh sách UI cũ
    document.querySelector(".list").innerHTML = "";
    filteredList.forEach((item) => {
        addItemToUI(item);
    });
});

//chức năng hiện thông tin
document.querySelector(".list").addEventListener("click", event => {
    //lấy list ra
    let list = getList();
    //lọc ra item nào có id giống event
    let item = list.find((item) => item.id == event.target.parentElement.parentElement.dataset.id);
    //dán item ra input
    document.querySelector("#name").value = item.name;
    document.querySelector("#price").value = item.price;
    document.querySelector("#amount").value = item.amount;
    document.querySelector("#description").value = item.description;
});

//chức năng clear ô input
document.querySelector(".btn-clear").addEventListener("click", event => {
    itemChoice = null;
    document.querySelectorAll(".input-item").forEach(item => {
        item.value = "";
    });
});
