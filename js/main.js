/* Settings Up Variables */



let dep = document.querySelectorAll('.dep'); 
const dep_length = dep.length;

let student_name = document.querySelector("#student_name");
let student_grade = document.querySelector("#student_grade");

let add_btn = document.querySelector("#add_btn");
let remove_btn = document.querySelectorAll(".remove");


let sort = document.querySelector("#sort");
let filter = document.querySelector("#filter");

let tbody = document.querySelector('tbody');



/* On Load */

window.onload = () => {
    UI.showAll();
    student_name.focus();
};

/* UI Class */


class UI{
    static showAll(){
        const students = Store.all();
        
        students.forEach(student => (UI.draw_row(student)));
    }

    static draw_row(student){
        
        let output = `
            <tr>
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td><button class="remove" data-id="${student.id}">Delete</button></td>
            </tr>
        `;

        tbody.innerHTML += output;
        
    }
}

/* Students Class */


class Student{
    constructor(id,name,grade){
        this.id = id;
        this.name = name;
        this.grade = grade;
    }
}


/* Store Class */

class Store{

    static all(){
        const students = localStorage.students ? localStorage.students : [];

        return JSON.parse(students);
    }

    static save(student){
        if(this.exist(student)){
            alert("This Student Is Already Exist!");
            return;
        }
        const students = this.all();

        students.push(student);

        localStorage.students = JSON.stringify(students);

        alert("Done!");
        console.log(student);

    }
    
    static exist(student){
        const name = student.name;
        const students = this.all();
        const filtered = Object.values(students).filter((e) => { return e.name == student.name;  });
        if(filtered.length > 0){
            return true;
        }
        return false;
    }

    static remove(id){
        let students = this.all();
        let output = [];
        output = students.filter((student) => {
            if(student.id != id){
                return true;
            }
        });

        localStorage.students = JSON.stringify(output);
    }

}



/* Create New Student */


add_btn.addEventListener('click', (e) => {
    if(student_name.value == ''){
        alert("Student Name Connot Be Empty!");
        return;
    }
    if(student_grade.value == ''){
        alert("Student Grade Connot Be Empty!");
        return;
    }
    
    let checked_dep = document.querySelectorAll(".dep:checked").length;
    if(checked_dep <= 0){
        alert("Student Department Connot Be Empty!");
        return;
    }

    let student_grade_parsed = 0;
    if(student_grade.value !== ''){
        if(isNaN(student_grade.value)){ 
            student_grade_parsed = parseInt(student_grade.value);
        }else{
            student_grade_parsed = parseInt(student_grade.value);
        }
    }
    
    const students = Store.all();
    const id = students.length + 1;
    const name = student_name.value;
    const grade = student_grade_parsed;

    let student = new Student(id,name,grade);

    if(!Store.exist(student)){
        UI.draw_row(student);
        Store.save(student);
    }else{
        alert("This Student Is Already Exist!");
    }


    clearFields();
    student_name.focus();
});


/* Delete Student */

document.addEventListener('click', (e) => {
    if(e.target.classList.contains("remove")){
         delete_student(e.target.dataset.id);
         e.target.parentElement.parentElement.remove();
    }
});

function delete_student(id){
    Store.remove(id);




}



/* Filtering */


sort.addEventListener('change', function(e){
    const sort_by = e.target.value;

    let students = Store.all();

    if(sort_by == 'name'){
        students = students.sort((student1,student2) => {
            return student1.name.localeCompare(student2.name);
        });
    }

    if(sort_by == 'grade'){
        students = students.sort((a,b) => {
            return a.grade - b.grade;
        });
    }
    
    tbody.textContent = "";

    students.forEach((student) => UI.draw_row(student));

});


filter.addEventListener('change', function(e){
    const filter_by = e.target.value;

    let students = Store.all();

    if(filter_by == 'success'){
        students = students.filter((student) => {
            if(student.grade >= 50){
                return true;
            }
        });
    }

    if(filter_by == 'fail'){
        students = students.filter((student) => {
            if(student.grade < 50){
                return true;
            }
        });
    }
    
    tbody.textContent = "";

    students.forEach((student) => UI.draw_row(student));

});





function clearFields(){
    student_name.value = "";
    student_grade.value = "";
    dep.forEach((e) => {
        e.checked = false;
    });
}