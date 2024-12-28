//1 sản phẩm bao gồm
function Product(name, price, amount, description) {
    this.name = name;
    this.price = price;
    this.amount = amount;
    this.description = description;
    this.id = new Date().toISOString();
}

//----------------------------------Store----------------------------------
function Store() { };
//.getProducts()
Store.prototype.getProducts =  function(){
    return JSON.parse(localStorage.getItem("products")) || [];
}

//.getProduct(id)
Store.prototype.getProduct = function (id){
    //lấy products
    let products = this.getProducts();
    //tìm product trùng id
    let product = products.find((product) => product.id == id);
    return product;
}

//.add(product)
Store.prototype.add = function (product) {
    //lấy list từ ls về
    let products = this.getProducts();
    //đẩy vô
    products.push(product);
    //đẩy lên ls
    localStorage.setItem("products", JSON.stringify(products));
}

//.remove(id)
Store.prototype.remove = function (id) {
    let products = this.getProducts();
    //từ id tìm vị trí
    let productIndex = products.findIndex(product => product.id == id);
    products.splice(productIndex, 1);
    //cập nhật lại ls
    localStorage.setItem("products", JSON.stringify(products));
}

//----------------------------------RenderUI----------------------------------
function RenderUI() { }
//.clearDataInput(): hàm này xoá ô input
RenderUI.prototype.clearDataInput = function (){
    itemChoice = 0;
    document.querySelectorAll(".input-item").forEach(item => {
        item.value = "";
    });
}
//.add(product)
RenderUI.prototype.add = function ({id, name, price}){
    let newCard = document.createElement("div");
    newCard.className = "card col-xs-12 col-md-6 col-lg-4";
    newCard.setAttribute("data-id", id);
    newCard.innerHTML = `
        <div class="card-img">
            <img src="https://www.anime-oz.com/assets/alt_3/HMR-64620.jpg?20211104222248" />
        </div>
        <div class="card-content d-flex flex-column justify-content-center fs-6">
            <div><span class="ps-3">${name}</span></div>
            <div class="d-flex justify-content-around">
                <span>${Number((Number(price) / 2).toFixed(0)).toLocaleString('vi')}</span>
                <span class="text-decoration-line-through">${Number(Number(price).toFixed(0)).toLocaleString('vi')}</span>
            </div>
        </div>
    `;
    document.querySelector(".list").appendChild(newCard);
}
//.alert(msg, type = "success"): hàm nhận vào msg và nhận vào type để hiển thị màu
RenderUI.prototype.alert = function (msg, type = "success") {
    //tạo div thông báo
    let divAlert = document.createElement("div");
    divAlert.className = `alert alert-${type} fs-6`;
    divAlert.innerHTML = msg;
    document.querySelector("#notification").appendChild(divAlert);
    //sau 2 giây xoá thông báo
    setTimeout(() => {
        divAlert.remove();
    }, 2000);
};
//.renderAll(): hàm này biến từng product trong products thành thẻ tr và hiển thị trong tbody
RenderUI.prototype.renderAll = function () {
    //lấy danh sách từ ls
    let store = new Store();
    let products = store.getProducts();
    document.querySelector(".list").innerHTML = "";
    products.forEach((product) => {
        this.add(product);
    });
};

//-------------------main flow (dòng chảy sự kiện chính)-------------------
//lấy obj vừa chọn ra
let itemChoice = 0; //biến để check xem sản phẩm nào đang được chọn
document.querySelector(".list").addEventListener("click", event => {
    let store = new Store();
    let product = store.getProducts();
    itemChoice = product.find((item) => item.id == event.target.parentElement.parentElement.dataset.id);
});

//DOMContentLoaded: trang load xong
document.addEventListener("DOMContentLoaded", (event) => {
    let ui = new RenderUI();
    ui.renderAll();
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
    let newProduct = new Product(name, price, amount, description);
    //lưu newProduct vào ls
    let store = new Store();
    store.add(newProduct);
    //hiển thị lên giao diện
    let ui = new RenderUI();
    ui.add(newProduct);
    ui.alert(`${name} đã được thêm vào danh sách`);
    //xoá value trong input
    ui.clearDataInput();
});

//Xoá
//sự kiện xoá 1 item
document.querySelector(".btn-remove").addEventListener("click", event => {
    let ui = new RenderUI();
    if(itemChoice){
        let idRemove = itemChoice.id;
        //tìm product trùng id
        let store = new Store();
        let product = store.getProduct(idRemove);
        //confirm
        let isConfirmed = confirm(`Bạn có chắc muốn xoá sản phẩm ${product.name} không?`);
        if(isConfirmed){
            //xoá ở ls
            store.remove(idRemove); //hàm nhận id, xoá product có id đó
            //xoá ở ui
            ui.renderAll();
            //hiện thông báo xoá thành công
            ui.alert(`Sản phẩm ${product.name} đã bị xoá`, "danger");
        };
    }else{
        ui.alert("Không có gì để xoá!", "warning");
    };
    ui.clearDataInput();
});

//Filter
//filter theo #filter
document.querySelector("#filter").addEventListener("keyup", event => {
    let inputValue = event.target.value //lấy giá trị vừa nhập
    let store = new Store();
    let products = store.getProducts();
    //filter
    let filteredProducts = products.filter((product) => (product.name.includes(inputValue)) || 
                                             (product.description.includes(inputValue)));
    //xoá danh sách UI cũ
    document.querySelector(".list").innerHTML = "";
    let ui = new RenderUI();
    filteredProducts.forEach((product) => {
        ui.add(product);
    });
});

//filter theo .btn-search
document.querySelector(".btn-search").addEventListener("click", event => {
    let inputValue = event.target.previousElementSibling.value //lấy giá trị vừa nhập
    //lấy products ra
    let store = new Store();
    let products = store.getProducts();
    //filter
    let filteredProducts = products.filter((product) => (product.name.includes(inputValue)) || 
                                            (product.description.includes(inputValue)));
    //xoá danh sách UI cũ
    document.querySelector(".list").innerHTML = "";
    let ui = new RenderUI();
    filteredProducts.forEach((product) => {
        ui.add(product);
    });
});

//chức năng hiện thông tin sau khi click sản phẩm
document.querySelector(".list").addEventListener("click", event => {
    //lấy products ra
    let store = new Store();
    let products = store.getProducts();
    //lọc ra item nào có id giống event
    let item = products.find((product) => product.id == event.target.parentElement.parentElement.dataset.id);
    //dán item ra input
    document.querySelector("#name").value = item.name;
    document.querySelector("#price").value = item.price;
    document.querySelector("#amount").value = item.amount;
    document.querySelector("#description").value = item.description;
});

//Nút clear ô input
document.querySelector(".btn-clear").addEventListener("click", event => {
    let ui = new RenderUI();
    ui.clearDataInput();
});