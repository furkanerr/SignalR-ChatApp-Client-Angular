import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { $ } from 'protractor';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }
  
   
 private hubConnection :signalR.HubConnection;
 
 public startConnection = () =>{

  this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

      this.hubConnection
      .start()
      .then((result) => {
        console.log('bağlantı başarıyla kuruldu')
      }).catch((err) => {
        console.log('bağlantı kurarken bir hata oldu')
      });
      this.hubConnection.on("connecitonIdAl",connecitonId =>{
 
      })

   this.hubConnection.on("receiveMessage",(message,name)  =>{
   const li = document.createElement("li");
   li.textContent =name +":"+ message;
     document.getElementById("mesajBolumu").appendChild(li);      
  });


 
  this.hubConnection.on("clientsIsimleriAl",clients =>{

    //document.getElementById("kisiListesi").innerHTML="";
    const a = document.createElement("a");
    a.innerHTML="";
    a.style.backgroundColor = "#25D366";
    a.style.marginLeft = "270px";
    a.style.color = "white";
    a.className="list-group-item list-group-item-action users ";   
    for (let i = 0; i < clients.length; i++) {   
      a.textContent =clients[i].name;
      
        document.getElementById("kisiListesi").appendChild(a);  
              
      console.log(clients[i].name);   
    }
  });
  
this.hubConnection.on("kisiyeGonder",message =>{
  console.log(message)
  var paragraf  = document.getElementById("paragraf");
  paragraf.innerHTML=message;
  const li = document.createElement("li");
   li.textContent = message;
     document.getElementById("mesajBolumu2").appendChild(li);   
})

 }


 Gonder(mesaj,name){
   console.log("Mesaj Gönderildi")
   console.log(mesaj,name)
  var message = mesaj;
  this.hubConnection.invoke("SendMessage",message,name).catch(err => console.log("bir hata meydana geldi.")) 
  document.getElementById("mesajText").remove;
  }
  
  KisiyeGonder(connectionId,message){
    console.log("kişi butonu ")
    this.hubConnection.invoke("KisiyeMesajGonder",connectionId,message).catch(err=> console.log("kişiye gonderirken hata ")
    )

  }

  GirisYap(name){
    console.log("Giriş yapıldı.")
    console.log(name)
    document.getElementById("nameInput").style.display="none";
    document.getElementById("ad").style.display="none";
    document.getElementById("girisButton").style.display="none";
    
    this.hubConnection.invoke("GetNickName",name).catch(err => console.log("giriş yapılamadı"))
    


  }

  

  ngOnInit(): void {
   this.startConnection();
  
  }

}
