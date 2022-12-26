function process(char, nagValue){
    if (Math.random()<nagValue/100){
        return char.toUpperCase()
    }
    else{
        return char
    }
}
function mockMe(inputString, nagValue){
    let newString = '"';
    for (let i = 0; i < inputString.length; i++) {
        newString += process(inputString[i], nagValue);
        }
    newString += '"';
    console.log(newString);
    return newString
}
function nagify() {
    var inputText = document.getElementById("inputTextArea").value;
    var outputTextArea = document.getElementById("outputTextArea");
    if(inputText===""){
        displayString = mockMe("Input an annoying comment", 50);
    }
    else{
        const nagValue = document.getElementById("nagRange").value
        displayString = mockMe(inputText, nagValue);
    }
    outputTextArea.value = displayString;
}

function copyToClipboard() {
    // Get the text field
    var copyText = document.getElementById("outputTextArea");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    if (copyText.value ===""){
        swal("There is no text to copy");
    }
    else{
        navigator.clipboard.writeText(copyText.value);
        swal("Text Copied", copyText.value + " Copied!", "success");
    }

    }

function test(){
    var value = document.getElementById("nagRange").value/50*100
    document.getElementById("nagRange").style.color = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
}