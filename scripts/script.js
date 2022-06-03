// Подгрузка изображений из папки
let images = [...document.querySelectorAll('.img-div')];//

images.forEach((image, idx) => {
  image.style.backgroundImage = `url(./images/${idx+1}.jpg)`
})


let doc = window.document,
    context = doc.querySelector('.js-slider'),
    items = doc.querySelectorAll('.js-item'),
    clones = [],
    disableScroll = false,
    scrollWidth = 0,
    scrollPos = 0,
    clonesWidth = 0


// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// Позиция по горизонтали
function getScrollPos () {
    return (context.pageXOffset || context.scrollLeft) - (context.clientLeft || 0)
}

function setScrollPos (pos) {
    context.scrollLeft = pos
}


// Ширина копий элементов
function getClonesWidth () {
    clonesWidth = 0
    Array.from(clones, clone => {
      clonesWidth = clonesWidth + clone.offsetWidth
    })
    return clonesWidth
}

// ОСНОВНЫЕ ФУНКЦИИ
// Пересчет
function reCalc () {
    scrollPos = getScrollPos()
    scrollWidth = context.scrollWidth
    clonesWidth = getClonesWidth()
  
    if (scrollPos <= 0) {
      setScrollPos(400) // Прокрутка на 1 пиксель, чтобы разрешить прокрутку влево
    }
}

// Бесконечная прокрутка
// ИСПРАВИТЬ БАГ С 400 ПИКСЕЛЯМИ  setScrollPos
function scrollUpdate () {
    if (!disableScroll) {
      scrollPos = getScrollPos()
  
      if (clonesWidth + scrollPos >= scrollWidth) {
        // Прокрутка влево, когда доберется до правого края
        setScrollPos(400) //Прокрутка вниз на 400 пикселей ДОРАБОТАТЬ - НУЖНО 1 ПИКСЕЛЬ
        disableScroll = true
      } else if (scrollPos <= 0) {
        // Прокрутка вправо, когда доберется до левого края
        setScrollPos(scrollWidth - clonesWidth - 400)
        disableScroll = true
      }
    }

    if (disableScroll) {
        window.setTimeout(function () {
          disableScroll = false
        }, 40)
      }
}

// Выполняется при загрузке страницы
function onLoad () {

    Array.from(items, item => {
      const clone = item.cloneNode(true)
      context.appendChild(clone)
      clone.classList.add('js-clone')
      let what = doc.querySelectorAll('.js-clone')
      //console.log(what)
    })

    clones = context.querySelectorAll('.js-clone')
  
    reCalc()
  
    context.addEventListener('scroll', function () {
      window.requestAnimationFrame(scrollUpdate)
    }, false)
  
    window.addEventListener('resize', function () {
      window.requestAnimationFrame(reCalc)
    }, false)
}

window.onload = onLoad




////////////////////////////////////////////////////////////////////////
// Draggable slider
/////////////////////////////////////////////////////////////////////////

let isDown = false;
let startX;
let scrollLeft;
const slider = document.querySelector('.js-slider');

// прекратить действие, когда клик отпущен
const end = () => {
	isDown = false;
  slider.classList.remove('active');
}

// начать действие драгслайдера
const start = (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
  
  /*
  console.log('первый параметр старта');
  console.log(e.pageX);
  //console.log(e.touches[0].pageX);
  console.log('третий параметр старта');
  console.log(slider.offsetLeft);
  */

  scrollLeft = slider.scrollLeft;	
}

//  помогити
const move = (e) => {

  // Пока мышка не опущена, ниче не делай
	if(!isDown) return;

  // Иначе делай это:
  reCalc () // пересчет координат - позволяет скролить бесконечно
  e.preventDefault(); // предотвращение события

  const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
  
  /*
  console.log('первый параметр мува');
  console.log(e.pageX);
  console.log('третий параметр мува');
  console.log(slider.offsetLeft);
  */

  // x - координата (относительно слайдера) по горизонтали, когда отпустил клик
  // startX - координата по горизонтали (относительно слайдера), когда нажал клик
  const dist = (x - startX); // вычисляется при каждом сдвиге на один пиксель
                             // берется координата клика
                             // от этой координаты, если смещение влево, то отрицательные значения
                             // если вмещение вправо, то положительные значения
  console.log(dist);
  slider.scrollLeft = scrollLeft - dist; // смещение в ту же сторону
  
  //scrollUpdate ()
}

(() => {
	slider.addEventListener('mousedown', start);
	slider.addEventListener('touchstart', start);

	slider.addEventListener('mousemove', move); // работает при каждом сдвиге на пиксель
	slider.addEventListener('touchmove', move);

	slider.addEventListener('mouseleave', end);
	slider.addEventListener('mouseup', end);
	slider.addEventListener('touchend', end);
})();