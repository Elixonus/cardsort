const deepCopyFunction = inObject =>
{
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
  }
  
  return outObject
}

var front_cards = ["AC.png", "AD.png", "AH.png", "AS.png", "2C.png", "2D.png", "2H.png", "2S.png", "3C.png", "3D.png", "3H.png", "3S.png", "4C.png", "4D.png", "4H.png", "4S.png", "5C.png", "5D.png", "5H.png", "5S.png", "6C.png", "6D.png", "6H.png", "6S.png", "7C.png", "7D.png", "8H.png", "8S.png", "9C.png", "9D.png", "9H.png", "9S.png", "JC.png", "JD.png", "JH.png", "JS.png", "QC.png", "QD.png", "QH.png", "QS.png", "KC.png", "KD.png", "KH.png", "KS.png"];
var front_cards_numbers = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12];
var back_cards = "red_back.png";

while(true)
{
    var number_of_cards = parseInt(prompt("Enter the number of cards [1-25]"));
    if(!Number.isInteger(number_of_cards))
    {
        continue;
    }

    if(number_of_cards >= 1 && number_of_cards <= 25)
    {
        break;
    }
}

for(var n = 0; n < front_cards.length; n++)
{
    var img = document.createElement("img");
    img.src = "images/" + front_cards[n];
    img.id = n;
    document.getElementById("images").appendChild(img);
}

var img = document.createElement("img");
img.src = "images/red_back.png";
img.id = "back";
document.getElementById("images").appendChild(img);



var cards = [];

for(var n = 0; n < number_of_cards; n++)
{
    var card =
    {
        id: Math.round(Math.random() * (front_cards.length - 1)),
        current_position: n,
        intended_position: n,
        current_flip: -1,
        intended_flip: -1
    };
    cards.push(card);
}

var back = document.getElementById("back");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var previous_time;
var current_time = 0;
var scale_factor = 0.2;
var camera =
{
    x: -0.5 * back.width - 50,
    y: 0
};
var keys = [];
var move_speed = 0.1;
var flip_speed = 0.1;
var command_stack = [];
var command = 0;
var cards_copy = deepCopyFunction(cards);

bubbleSort(cards_copy);

function render()
{
    //LOGIC
    
    if(keys.includes("ArrowUp") || keys.includes("w") || keys.includes("W"))
    {
        camera.y -= 6;

        if(camera.y < 0.5 * (back.height * scale_factor - canvas.height) + 50)
        {
            camera.y = 0.5 * (back.height * scale_factor - canvas.height) + 50;
        }
    }
    
    if(keys.includes("ArrowDown") || keys.includes("s") || keys.includes("S"))
    {
        camera.y += 6;

        if(camera.y > 0.5 * (canvas.height - back.height * scale_factor) - 50)
        {
            camera.y = 0.5 * (canvas.height - back.height * scale_factor) - 50;
        }
    }
    
    if(keys.includes("ArrowLeft") || keys.includes("a") || keys.includes("A"))
    {
        camera.x -= 6;

        if(camera.x < -0.5 * back.width * scale_factor - 50)
        {
            if(camera.x > -0.5 * back.width * scale_factor - 50)
            {
                camera.x = -0.5 * back.width * scale_factor - 50;
            }
            else
            {
                camera.x = 0.8 * camera.x + 0.2 * (-0.5 * back.width * scale_factor - 50);
            }
        }
    }
    
    if(keys.includes("ArrowRight") || keys.includes("d") || keys.includes("D"))
    {
        camera.x += 6;

        if(camera.x > (cards.length - 0.5) * back.width * scale_factor - canvas.width + 50)
        {
            if(camera.x < (cards.length - 0.5) * back.width * scale_factor - canvas.width + 50)
            {
                camera.x = (cards.length - 0.5) * back.width * scale_factor - canvas.width + 50;
            }
            else
            {
                camera.x = 0.8 * camera.x + 0.2 * ((cards.length - 0.5) * back.width * scale_factor - canvas.width + 50);
            }
        }
    }
    
    for(var n = 0; n < number_of_cards; n++)
    {
        var card = cards[n];
        card.current_position = clamp(card.current_position + Math.sign(card.intended_position - card.current_position) * move_speed, card.current_position, card.intended_position);
        card.current_flip = clamp(card.current_flip + Math.sign(card.intended_flip - card.current_flip) * flip_speed, card.current_flip, card.intended_flip);
    }
    
    //RENDER
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var n = 0; n < number_of_cards; n++)
    {
        var object = document.getElementById(cards[n].id);
        
        if(cards[n].current_flip > 0)
        {
            ctx.drawImage(object, cards[n].current_position * back.width * scale_factor - 0.5 * (cards[n].current_flip * back.width * scale_factor) - camera.x, 0.5 * (canvas.height - back.height * scale_factor) - camera.y, cards[n].current_flip * back.width * scale_factor, back.height * scale_factor);
        }
        
        if(cards[n].current_flip < 0)
        {
            ctx.drawImage(back, cards[n].current_position * back.width * scale_factor - 0.5 * (cards[n].current_flip * back.width * scale_factor) - camera.x, 0.5 * (canvas.height - back.height * scale_factor) - camera.y, cards[n].current_flip * back.width * scale_factor, back.height * scale_factor);
        }
    }
    
    requestAnimationFrame(render);
}

window.onload = function()
{
    render();
    setTimeout(time, 1000);
};

document.onkeydown = addKey;
document.onkeyup = subtractKey;

function addKey(e)
{
    e = e || window.event;
    
    if(!keys.includes(e.key))
    {
        keys.push(e.key);
    }
}

function subtractKey(e)
{
    e = e || window.event;
    
    if(keys.includes(e.key))
    {
        for(var n = 0; n < keys.length; n++)
        {
            if(keys[n] == e.key)
            {
                keys.splice(n, 1);
            }
        }
    }
}

function bubbleSort(array)
{
    var l = array.length;
    
    for(var n = 0; n < l - 1; n++)
    {
        var swapped = false;
        
        for(var m = 0; m < l - n - 1; m++)
        {
            command_stack.push(["flip", m]);
            
            if(~~(array[m].id / 4) > ~~(array[m + 1].id / 4))
            {
                command_stack.push(["swap", m]);
                var t = array[m].id;
                array[m].id = array[m + 1].id;
                array[m + 1].id = t;
                
                swapped = true;
            }
            
            command_stack.push(["flip", m]);
        }
        
        if(!swapped)
            break;
    }
}

function resize()
{
    if(window.innerWidth / window.innerHeight > canvas.width / canvas.height)
    {
        canvas.style.width = window.innerHeight / window.innerWidth * 100 + "%";
        canvas.style.height = "100%";
    }
    
    else
    {
        canvas.style.width = "100%";
        canvas.style.height = window.innerWidth / window.innerHeight * 100 + "%";
    }
}

resize();

function clamp(val, range1, range2)
{
    if(range1 < range2)
    {
        if(val < range1)
        {
            return range1;
        }
        
        if(val > range2)
        {
            return range2;
        }
        
        return val;
    }
    
    if(range1 > range2)
    {
        if(val < range2)
        {
            return range2;
        }
        
        if(val > range1)
        {
            return range1;
        }
        
        return val;
    }
    
    return val;
}

function time()
{
    if(command == command_stack.length)
    {
        for(var n = 0; n < number_of_cards; n++)
        {
            cards[n].intended_flip = 1;
        }
        
        command++;
    }
    
    if(command < command_stack.length)
    {
        if(command_stack[command][0] == "flip")
        {
            cards[command_stack[command][1]].intended_flip *= -1;
            cards[command_stack[command][1] + 1].intended_flip *= -1;
        }
        
        if(command_stack[command][0] == "swap")
        {
            var temp1 = cards[command_stack[command][1]];
            cards[command_stack[command][1]] = cards[command_stack[command][1] + 1];
            cards[command_stack[command][1] + 1] = temp1;
            
            var temp2 = cards[command_stack[command][1]].intended_position;
            cards[command_stack[command][1]].intended_position = cards[command_stack[command][1] + 1].intended_position;
            cards[command_stack[command][1] + 1].intended_position = temp2;
        }
        
        command++;
    }
    
    setTimeout(time, 1000);
}
