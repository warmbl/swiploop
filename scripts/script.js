// Подгрузка изображений из папки
let images = [...document.querySelectorAll('.img-div')];//

images.forEach((image, idx) => {
  image.style.backgroundImage = `url(./images/${idx+1}.jpg)`
})


var doc = window.document,
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
      setScrollPos(1) // Прокрутка на 1 пиксель, чтобы разрешить прокрутку влево
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
      console.log(what)
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
