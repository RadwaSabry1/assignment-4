
const server=require("express")
const path=require("path")
const fs=require("fs")
const s=server()
s.listen(2000)
const filePath = path.resolve("file.txt");
const file=fs.readFileSync(path.resolve("file.txt"),"utf-8")
function readUsers() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
}
 
function writeUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
//1
s.use(server.json())
s.route("/users").post((req,res,next)=>{
     let users=readUsers()


    const f=users.find((u)=>{
        return    req.body.email===u.email

    })
    if(f)
        return res.status(409).json({message:"already exist"})
    next()
},(req,res,next)=>{
    users.push(req.body)
    writeUsers(users)
     res.status(201).json({message:`done`})
}).delete( (req, res) => {
    let users = readUsers();

    const id = Number(req.body.id); 

    if (!id) {
        return res.status(400).json({ message: "id is required" });
    }

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "not exist" });
    }

    users.splice(index, 1);
    writeUsers(users);

    res.status(200).json({
        message: "deletion done",
        deletedId: id
    });
})
.get((req, res,next) => {
         let users=readUsers()

const f=users.find((u)=>{
        return    req.query.name===u.name})
if(f){
   return res.status(200).json(f)
}
res.status(404).json({message:"not found"})
        })

            
s.patch("/ad/:id/:age", (req, res,next) => {
     let users=readUsers()

    const f = users.find(u => u.id === Number(req.params.id));

    if(!f)
        return res.status(404).json({message: "not found"});

    f.age = req.params.age; 
    writeUsers(users)

    res.status(200).json({message: "updated", user: f});
});

//5
s.get("/get",(req, res,next) => {
       res.status(200).sendFile(path.resolve("file.txt"))

})
s.get("/user/filter", (req, res) => {
    const users = readUsers();

    const minAge = Number(req.query.age);

    if (!minAge) {
        return res.status(400).json({ message: "age query is required" });
    }

    const filteredUsers = users.filter(u => Number(u.age) >= minAge);

    res.status(200).json(filteredUsers);
});
s.get("/user/:id", (req, res) => {
    const users = readUsers();          
    const id = Number(req.params.id);      

    const user = users.find(u => u.id === id); 
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(user);
});
