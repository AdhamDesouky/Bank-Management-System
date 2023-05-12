#include <bits/stdc++.h>
using namespace std;
#define endll '\n'
class Transaction;
class Client;
template <class>
class Node;
template <class>
class ClientsLinkedList;
template<class T>
T catcher(T e);
string input();
string spacedInput();
Node<Client>* checkForEM(string em1);
void printAllLLs();
void loginMenu();
void forgotPass();
int newIDGen();
void newClientMenu();
void link();
template<class T>
void transactionsMenu(Node<T> *tmp);
void clientHome(Node<Client> *tmp);
void mainMenu();
bool checkSpaces(const string& s);
Transaction newTransaction(Node<Client>*people);
int partition(int low, int high);
void quickSort(int low, int high);

Node<Client>* arrayOfClients[10];
bool checkSpaces(const string& s){
    for (char i:s) {
        if(i==' '){
            return true;
        }
    }
    return false;
}

template<class T>
T catcher(T e){
    while(cin.fail()){
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(),'\n');
        cout << "Invalid input. Enter a NUMBER: ";
        cin>>e;
    }
    return e;
}
string spacedInput(){
    string s;
    getline(cin,s);
    while (s.empty()){
        cout<<"Invalid Input.\nPlease enter a non empty line: ";
        getline(cin,s);
    }
    return s;
}
string input(){
    string s;
    getline(cin,s);
    while (s.empty() || checkSpaces(s)){
        cout<<"Invalid Input.\nPlease enter a non empty line: ";
        getline(cin,s);
    }
    return s;
}
// base classes/////////////////////////////////////////////////////////////
class Transaction{
private:
    int transactionID;
    double transactionAmount;
    string transactionType, transactionTime;
public:
    Transaction(){
        transactionID=0;
        transactionType="";
        transactionTime="";
        transactionAmount=0;
    }
    Transaction(int TID,string TN,string TD,double am){
        transactionID=TID;
        transactionType=TN;
        transactionTime=TD;
        transactionAmount=am;
    }
    //setters
    void setTID(int n){transactionID=n;}
    void setTT(string s){ transactionType=s;}
    void setTD(string s){transactionTime=s;}
    void setTA(double a){transactionAmount=a;}
    //getters
    int getTID(){return transactionID;}
    string getTT(){return  transactionType;}
    string getTD(){return transactionTime;}
    double getTA(){return transactionAmount;}


    void PrintTransactionInfo() {
        cout << "=========================\n";
        cout << "Transaction ID: \t" << getTID() << endll;
        cout << "Transaction type: \t" << getTT() << endll;
        cout << "Transaction amount: \t" << getTA() << endll;
        cout << "Transaction date: \t" << getTD() << endll;
        cout << "=========================\n";
    }

};
class Client{
private:
    string clientName, clientEmail, clientPhone, clientAddress, clientPassword;
    int clientID;
public:
    Transaction transaction[6];
    Client(){
        clientName="";
        clientEmail="";
        clientPhone="";
        clientAddress="";
        clientPassword="";
        clientID=1000;
    }

    Client(string cN, string cE, string cP, string cA, string cPW, int CID){
        clientName=std::move(cN);
        clientEmail=std::move(cE);
        clientPhone=std::move(cP);
        clientAddress=std::move(cA);
        clientPassword=std::move(cPW);
        clientID=CID;
    }
    //setters
    void setCN(string s){clientName=s;}
    void setCE(string s){clientEmail=s;}
    void setCPN(string s){clientPhone=s;}
    void setCA(string s){clientAddress=s;}
    void setCPW(string s){clientPassword=s;}
    void setCID(int n){clientID=n;}
    //getters
    string getCN(){return clientName;}
    string getCE(){return clientEmail;}
    string getCPN(){return clientPhone;}
    string getCA(){return clientAddress;}
    string getCPW(){return clientPassword;}
    int getCID(){return clientID;}

    void PrintClientInfo() {
        cout << "=========================\n";
        cout << "Client ID: \t\t" << getCID() << endll;
        cout << "Client name: \t\t" << getCN() << endll;
        cout << "Client email: \t\t" << getCE() << endll;
        cout << "Client phone number: \t" << getCPN() << endll;
        cout << "Client address: \t" << getCA() << endll;
        if(transaction[0].getTID()==0){
            cout<<"No transactions\n";
        }
        else {
            cout << "=========================\n";
            cout << "Client Transactions: \t\n";
            for (int i = 0; i < 5; ++i) {
                if(transaction[i].getTID()!=0){
                    transaction[i].PrintTransactionInfo();
                }
            }
        }
        cout << "=========================\n";
    }
};
//////////////////////////////////////////////////////////////////////////////

// ll
template <class>
class Node{
public:
    Client cln;
    Node<Client>* next;
    //node constructor
    Node(Client e){
        cln=e;
        next = nullptr;
    }
};
template <class>
class ClientsLinkedList {
public:
    Node<Client> *head;
    int llSize = 0;
    ClientsLinkedList() {
        head = nullptr;
        link();
    }

    bool insert_client(Client c) {
        auto *newNode = new Node<Client>(c);
        Node<Client> *tmp, *big;
        for (int i = 0; i < 10; ++i) {//////////////////error/////////////
            link();
            big = arrayOfClients[i];
            while (big != nullptr) { //check if same email exists
                if (big->cln.getCE() == c.getCE()) {
                    cout << "Email already exists.\n";
                    return false;
                }
                big = big->next;
            }
        }
        //
        if (head == nullptr) { //if not initialized
            head = newNode;
            cout << newNode->cln.getCE() << " is added to the list" << endll;
            llSize++;
            return true;
        }
        tmp = head;
        while (tmp!= nullptr&&tmp->next != nullptr)
            tmp = tmp->next;

        tmp->next = newNode;
        cout << c.getCE() << " is added to the list\n";
        llSize++;
        return true;
    }

//    void delID(int ID){
//        Node<Client>* temp = head,*prev = nullptr;
//        if (head== nullptr)
//            return;
//        if (temp != nullptr&& temp->cln.getCID() == ID) {
//            head = temp->next;
//            delete temp;
//            return;
//        }
//        while (temp != nullptr && temp->cln.getCID() != ID) {
//            prev = temp;
//            temp = temp->next;
//        }
//        if (temp == nullptr)
//            return;
//
//        prev->next = temp->next;
//        delete temp;
//    }
    void printLL() {
        int cnt = 1;
        Node<Client> *curr = head;
        while (curr != nullptr) {
            cout << "Client number " << cnt << " :\n";
            curr->cln.PrintClientInfo();
            curr = curr->next;
            cnt++;
        }
        cout << "\n=======End of list=======\n\n";
    }

};

ClientsLinkedList<Client> clientsLL[10];

void sortLLs() {//bonus
    for (int i = 0; i < 10; ++i) {
        Node<Client>* head=clientsLL[i].head,*h=head,*nex;
        while (h!= nullptr){
            nex=h->next;
            while (nex!= nullptr) {
                if (nex->cln.getCID() < h->cln.getCID()) {
                    swap(nex->cln, h->cln);
                }
                nex = nex->next;
            }
            h=h->next;
        }
    }
}
int partition(int low, int high){
    int p=clientsLL[high].llSize,smallInd= low-1;
    // Index of smaller element and indicates the right position of pivot found so far

    for (int i= low; i <high; i++) {
        if (clientsLL[i].llSize < p) {// If current element is smaller than the pivot
            smallInd++; // increment index of smaller element
            swap(clientsLL[smallInd], clientsLL[i]);
        }
    }
    swap(clientsLL[smallInd+ 1], clientsLL[high]);
    return smallInd+ 1;
}

void quickSort(int low, int high)
{
    if (low < high) {
        //pi is partitioning index, clientsLL[p] is now at right place
        int part = partition(low, high);
        // sort elements before partition and after partition
        quickSort(low, part - 1);
        quickSort(part+ 1, high);
    }
}

//easy functions/////////////////////////////////////////////////////////////
void printAllLLs(){
    for (int i = 0; i < 10; ++i) {
        cout<<"Index #"<<i+1<<" : Linked list of "<<clientsLL[i].llSize<<" clients.\n";//size of ll
        if(clientsLL[i].llSize!=0){
            cout<<"Clients of index number "<<i+1<<" : \n";
            clientsLL[i].printLL();
        }
    }
}
void loginMenu() {
    link();
    string em;
    string pw;
    cout << "+++++++++++Welcome back dear client++++++++++++\n"
         << "Please enter your email: \n>>";
    cin >> em;
    cout << "Please enter your password: \n>>";
    cin >> pw;
    Node<Client> *big;
    for (int i = 0; i < 10; ++i) {//////////////////error/////////////
        big=arrayOfClients[i];
        while(big != nullptr){ //check if same email exists
            if(big->cln.getCE()==em&&big->cln.getCPW()==pw){
                cout<<"Login successful.\n";
                clientHome(big);
                return;
            }
            big= big->next;
        }
    }
    cout<<"Invalid email or password.\n";
    cout<<"===============================================\n";
}
Node<Client>* checkForEM(string em1){
    Node<Client>*big;
    for (int i = 0; i < 10; ++i) {
        big=arrayOfClients[i];
        while(big != nullptr){ //check if email exists
            if(big->cln.getCE()==em1){
                return big;
            }
            big= big->next;
        }
    }
    return nullptr;
}


void forgotPass(){
    cout << "+++++++++++Welcome back dear client++++++++++++\n"
         << "Please enter your email: \n>>";
    string em1;
    cin.ignore();
    em1=input();
    cout << "Please reenter your email: \n>>";
    string em2;
    em2=input();
    link();
    if(em1==em2){
        Node<Client> *big;
        for (int i = 0; i < 10; ++i) {
            big=arrayOfClients[i];
            while(big != nullptr){ //check if email exists
                if(big->cln.getCE()==em1){
                    cout<<"Your password is: ";
                    cout<<big->cln.getCPW();
                    cout<<endll;
                    return;
                }
                big= big->next;
            }
        }
        cout<<"Email not found.\n";
        return;
    }
    cout << "===============================================\n";
}
int newIDGen(){
    return (rand() % 500)%300+1;
}
void newClientMenu(){
    cout << "+++++++++++Create new client account+++++++++++\n"
         << "Please enter your name: \n>>";
    string name;
    cin.ignore();
    name=spacedInput();
    cout << "Please enter your email: \n>>";
    string em;
    cin >> em;
    cout << "Please enter your phone: \n>>";
    string pn;
    cin >> pn;
    cout << "Please enter your password: \n>>";
    string pw;
    cin >> pw;
    cout << "Please enter your address: \n>>";
    string ad;
    cin >> ad;
    cout << "===============================================\n";
    int idd=newIDGen();
    Client c(name,em,pn,ad,pw,idd);
    clientsLL[idd%10].insert_client(c);
}
Transaction newTransaction(Node<Client>* people){
    cout<< "++++++++++++++++++++++New transaction++++++++++++++++++++++\n"
        <<"Enter transaction type: (Deposit / withdrawal / transfer) \n>>";
    string t;
    cin.ignore();
    t=input();
    transform(t.begin(),t.end(),t.begin(),::tolower);
    if(t=="transfer"){
        cout<<"Enter Email of recipient:\n>";
        string email;
        cin>>email;
        Node<Client>* john= checkForEM(email);//¯\_(ツ)_/¯
        if(john!= nullptr){
            cout<<"Enter amount: \n>>";
            double am;
            cin>>am;
            am= catcher(am);
            time_t now = time(nullptr);
            string dt= ctime(&now);
            int idd=newIDGen();
            string newTN,newTn2;
            newTn2+="Transfer to ";
            newTn2+=john->cln.getCN();
            newTN+="Transfer from ";
            newTN+=people->cln.getCN();
            Transaction x(idd,newTN,dt,am);
            Transaction y(idd,newTn2,dt,am);
            for (int i = 0; i < 6; ++i) {
                if(john->cln.transaction[i].getTID()==0) {
                    john->cln.transaction[i] = x;
                    break;
                }
            }
            cout<<"Transaction added.\n";
            return y;
        }
        else cout<<"Email does not exist.\n";
    }
    cout<<"Enter amount: \n>>";
    double am;
    cin>>am;
    am= catcher(am);
    time_t now = time(nullptr);
    string dt= ctime(&now);
    int idd=newIDGen();
    Transaction x(idd,t,dt,am);
    cout<<"Transaction added.\n";
    return x;
}
void transactionsMenu(Node<Client> *tmp){
    abdo:
    cout << "++++++Welcome to the transactions system++++++\n"
         << "CHOOSE ONE OF THE FOLLOWING OPTIONS: \n"
         <<"1. Create a new transaction\n"
         <<"2. View your transactions\n"
         <<"3. Delete a transaction by its ID\n"
         <<"4. Main menu\n";
    int n,cnt;
    cin>>n;
    n= catcher(n);
    switch (n) {
        case 1:
            if(tmp->cln.transaction[4].getTID()!=0){
                cout<<"Transaction limit reached.\n";
                break;
            }

            for (int i = 0; i < 5; ++i) {
                if(tmp->cln.transaction[i].getTID()==0){
                    tmp->cln.transaction[i]=newTransaction(tmp);
                    break;
                }
            }
            break;
        case 2:
            cnt=0;
            for (int i = 0; i < 5; ++i) {
                if(tmp->cln.transaction[i].getTID()!=0){
                    tmp->cln.transaction[i].PrintTransactionInfo();
                    cnt++;
                }
                else break;
            }
            if(cnt==0)cout<<"No transactions.\n";
            break;
        case 3:
            cout<<"Enter transaction ID: \n>>";
            int x;
            cin>>x;
            x= catcher(x);
            for (int i = 0; i < 5; ++i) {
                if(tmp->cln.transaction[i].getTID()==x){
                    tmp->cln.transaction[i].PrintTransactionInfo();
                    for (int j = i; j <5 ; ++j) {
                        tmp->cln.transaction[j]=tmp->cln.transaction[j+1];
                    }
                    cout<<"DELETED\n";
                    goto abdo;
                }
            }
            cout<<"ID not found.\n";
            break;
        case 4:
            return;
        default:
            cout << "Invalid Input.\n";goto abdo;
    }
    clientHome(tmp);
    cout << "===============================================\n";
}
void changePersonalInfo(Node<Client>*tmp){
    cout << "++++++++++++++++Edit info++++++++++++++++\n";
    cout<<"Enter password to continue:\n>>";
    string p;
    cin.ignore();
    p=input();
    if(p==tmp->cln.getCPW()){
        cout<<"Password correct.\n";
    }
    else {cout<<"Incorrect password, returning to main menu.\n";return;}
    cout << "CHOOSE AN ATTRIBUTE TO MODIFY: \n"
         <<"1. Name\n"
         <<"2. Email\n"
         <<"3. Phone\n"
         <<"4. Password\n"
         <<"5. Address\n"
         <<"6. Home page\n>>";
    int n;
    cin>>n;
    n= catcher(n);

    string s;
    switch (n) {
        case 1:
            cout<< "Please enter new name: \n>>";
            cin.ignore();
            s=spacedInput();
            cout<<"Name modified.\nNew name is "<<s<<endll;
            tmp->cln.setCN(s);
            break;
        case 2:
            cout << "Please enter new email: \n>>";
            s=input();
            cout<<"Email modified.\nNew email is "<<s<<endll;
            tmp->cln.setCE(s);
            break;
        case 3:
            cout << "Please enter new phone: \n>>";
            s=input();
            cout<<"Phone modified.\nNew phone is "<<s<<endll;
            tmp->cln.setCPN(s);
            break;
        case 4:
            cout << "Please enter new password: \n>>";
            s=input();
            cout<<"Password modified.\n";
            tmp->cln.setCPW(s);
            break;
        case 5:
            cout << "Please enter new address: \n>>";
            s=input();
            cout<<"Address modified.\nNew address is "<<s<<endll;
            tmp->cln.setCA(s);
            break;
        case 6:
            return;
        default:
            cout<<"Invalid Input.\n";
            changePersonalInfo(tmp);
    }
}

void clientHome(Node<Client> *tmp){
    abdo:
    cout << "+++++++++++Welcome to the home page++++++++++++\n"
         << "CHOOSE ONE OF THE FOLLOWING OPTIONS: \n"
         <<"1. Transactions menu\n"
         <<"2. View personal info\n"
         <<"3. Change personal info\n"
         <<"4. Logout\n";
    int n;
    cin>>n;
    n= catcher(n);
    switch (n) {
        case 1:
            transactionsMenu(tmp);
            break;
        case 2:
            tmp->cln.PrintClientInfo();
            clientHome(tmp);
            break;
        case 3:
            changePersonalInfo(tmp);
            break;
        case 4:
            return;
        default:
            cout << "Invalid Input.\n";goto abdo;
    }
    cout << "===============================================\n";
}
void mainMenu(){
    while (true) {
        cout << "===============================================\n"
             << "+++++++++Welcome to the Banking system+++++++++\n\n"
             << "CHOOSE ONE OF THE FOLLOWING OPTIONS\n"
             << "1. Login to your account\n"
             << "2. New client\n"
             << "3. Forgot my password\n"
             << "4. Sort clients by LL size using quicksort\n"
             << "5. Print all LLs\n"
             << "6. Sort all LLs using IDs\n"
             << "7. Exit the program\n"
             << "===============================================\n";
        int n;
        cin>>n;
        n= catcher(n);
        switch (n) {
            case 1:
                loginMenu();
                break;
            case 2:
                newClientMenu();
                break;
            case 3:
                forgotPass();
                break;
            case 4:
                quickSort( 0, 9);
                cout<<"Sorted.\n";
                break;
            case 5:
                printAllLLs();
                break;
            case 6:
                sortLLs();
                cout<<"Sorted.\n";
                break;
            case 7:
                return;
            default:
                cout << "Invalid Input.\n";
        }
    }
}
void link(){
    for (int i = 0; i < 10; ++i) {
        arrayOfClients[i]=clientsLL[i].head;
    }
}
int main() {
    link();
    mainMenu();
}