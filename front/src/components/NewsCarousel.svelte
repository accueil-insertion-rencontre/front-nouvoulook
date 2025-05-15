<script>
    export let newsList = [];
    let currentIndex = 0;
    const pageSize = 1;
    $: pagedNews = newsList.slice(currentIndex, currentIndex + pageSize);
    function showPrev() {
      currentIndex = Math.max(0, currentIndex - 1);
    }
    function showNext() {
      if (currentIndex + 1 < newsList.length) {
        currentIndex += 1;
      }
    }
    let forceColumn = true;
  </script>
  
  <div class="d-flex align-items-center justify-content-center mb-4 gap-2">
    <button class="btn btn-outline-secondary px-3 py-2" on:click={showPrev} disabled={currentIndex === 0} aria-label="Précédent" style="opacity:{currentIndex === 0 ? 0.5 : 1};">&lt;</button>
    <h2 class="mb-0 text-center flex-grow-1" style="color:#e87c3d; font-size:2.5rem;">Actualités</h2>
    <button class="btn btn-outline-secondary px-3 py-2" on:click={showNext} disabled={currentIndex + 1 >= newsList.length} aria-label="Suivant" style="opacity:{currentIndex + 1 >= newsList.length ? 0.5 : 1};">&gt;</button>
  </div>
  
  {#if newsList.length === 0}
    <div class="text-center text-muted my-5" style="font-size:1.3rem;">Aucune actualité pour le moment</div>
  {:else}
    <div class="row g-4">
      {#each pagedNews as news (news.id)}
        <div class="col-10 mx-auto d-flex justify-content-center">
          <article class="card news-featured-card flex-row align-items-stretch shadow-lg w-100 {forceColumn ? 'vertical' : ''}" style="max-width:1100px;">
            {#if news.imageUrl}
              <div class="news-featured-img-wrapper big {forceColumn ? 'vertical' : ''}">
                <img src={news.imageUrl.startsWith('/assets') ? `${import.meta.env.PUBLIC_API_URL || 'http://localhost:3001'}${news.imageUrl}` : news.imageUrl} class="news-featured-img big {forceColumn ? 'vertical' : ''}" alt={news.title} />
              </div>
            {/if}
            <div class="card-body d-flex flex-column justify-content-center p-5 news-featured-content">
              <h5 class="card-title mb-2" style="font-size:1.7rem; font-weight:700; color:#3a2d4d;">{news.title}</h5>
              <p class="card-text mb-3" style="font-size:0.95rem; line-height:1.6; color:#222;">{@html news.textContent}</p>
              <div class="mt-auto text-muted" style="font-size:1.1rem;">{new Date(news.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>
          </article>
        </div>
      {/each}
    </div>
  {/if}
  
  <style>
  .news-featured-card {
    min-height: 260px;
    border-radius: 1.2rem;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 0 auto;
  }
  .news-featured-card.vertical {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .news-featured-img-wrapper {
    flex: 0 0 140px;
    max-width: 140px;
    overflow: hidden;
    display: flex;
    align-items: stretch;
  }
  .news-featured-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 180px;
    max-height: 380px;
    border-top-left-radius: 1.2rem;
    border-bottom-left-radius: 1.2rem;
  }
  .news-featured-img-wrapper.big {
    flex: 0 0 40%;
    max-width: 40%;
  }
  .news-featured-img.big {
    min-height: 260px;
    max-height: 420px;
  }
  .news-featured-img-wrapper.vertical {
    max-width: 100% !important;
    flex: unset !important;
    height: 220px !important;
  }
  .news-featured-img.vertical {
    border-radius: 1.2rem 1.2rem 0 0 !important;
    min-height: 180px !important;
    max-height: 220px !important;
  }
  .news-featured-content {
    flex: 1 1 60%;
  }
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    z-index: 2000;
  }
  .modal-news {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 8px 32px 0 #0003, 0 2px 8px #0001;
    z-index: 2100;
    max-width: 900px;
    width: 96vw;
    min-height: 320px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
  }
  .modal-img-wrapper {
    width: 100%;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    max-width: 100%;
    padding: 0;
    height: 220px;
  }
  .modal-img {
    width: 100%;
    height: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: 1.2rem 1.2rem 0 0;
  }
  .modal-content-wrapper {
    width: 100%;
    min-width: 0;
    background: #fff;
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    max-height: 70vh;
    min-height: 0;
  }
  .modal-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #3a2d4d;
  }
  .modal-desc {
    font-size: 1.2rem;
    color: #222;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 900px) {
    .news-featured-card {
      flex-direction: column;
      min-height: unset;
      border-radius: 1rem;
      max-width: 98vw !important;
    }
    .news-featured-img-wrapper {
      max-width: 100%;
      flex: unset;
      height: 180px;
    }
    .news-featured-img {
      border-radius: 1rem 1rem 0 0;
      min-height: 120px;
      max-height: 180px;
    }
    .modal-news {
      flex-direction: column;
      min-width: 0;
      max-width: 98vw;
      min-height: unset;
      padding: 0;
    }
    .modal-img-wrapper, .modal-content-wrapper {
      flex: unset;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      padding: 0;
    }
    .modal-img {
      max-width: 100vw;
      max-height: 220px;
      border-radius: 1.2rem 1.2rem 0 0;
    }
    .modal-content-wrapper {
      padding: 1.2rem 1rem;
      max-height: 70vh;
    }
  }
  </style>
  