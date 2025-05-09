import type { APIRoute } from 'astro';

// Désactiver le prérendu pour cet endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { path, userAgent } = body;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    console.log('Données reçues:', { path, userAgent, ipAddress });

    // Vérifier si c'est un bot
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    if (isBot) {
      console.log('Bot détecté, visite ignorée');
      return new Response(JSON.stringify({ message: 'Bot détecté, visite ignorée' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Appeler l'API backend pour enregistrer la visite
    console.log('Appel de l\'API backend:', `${import.meta.env.API_URL}/statistics/pageview`);
    
    const response = await fetch(`${import.meta.env.API_URL}/statistics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        ipAddress,
        userAgent,
      }),
    });

    const responseData = await response.json();
    console.log('Réponse de l\'API backend:', responseData);

    if (!response.ok) {
      console.error('Erreur API backend:', responseData);
      return new Response(JSON.stringify({ 
        message: 'Erreur lors de l\'enregistrement de la visite',
        details: responseData 
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Visite enregistrée avec succès',
      details: responseData 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la visite:', error);
    return new Response(JSON.stringify({ 
      message: 'Erreur lors de l\'enregistrement de la visite',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 