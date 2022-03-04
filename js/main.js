const url = 'docs/pdf.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.55,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');


// Render the page (process used in a website code so that pages are interactive with users)
const renderPage = num => {
    pageIsRendering = true; /*letting the program know that is rendering */

    // Get the page
    pdfDoc.getPage(num).then(page => {
        // Set the scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
        // output the current page
        document.querySelector('#page-num').textContent = num;
    });
}

// Check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num;
    } else{
        renderPage(num);
    }
}

// Show prev page
const showPrevPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum --;
    queueRenderPage(pageNum);
}

// Show next page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum ++;
    queueRenderPage(pageNum);
}



// Get the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages; /*the number of pages is shown in the browser */

    renderPage(pageNum) /*call the renderPage and pass in the initial page 1*/
})
// catch error
.catch(err =>{
    // Display error and we gonna create a div
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // remove the top bar
    document.querySelector('.top-bar').style.display = 'none';
});



// Button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);