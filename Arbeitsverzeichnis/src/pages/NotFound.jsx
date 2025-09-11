import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

export default function NotFound(){
  return (
    <div className="max-w-3xl mx-auto p-12 text-center">
      <Helmet>
  <title>404 Seite nicht gefunden – Solar Inhalt fehlt ZOE DE</title>
  <meta name="description" content="404 Fehlerseite: Inhalt existiert nicht oder wurde verschoben – URL prüfen oder zur Startseite zurückkehren und Navigation nutzen für passende Solar Themen." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
  <Heading as="h1" size="3xl" className="mb-4">Seite nicht gefunden</Heading>
  <p className="text-neutral-600 mb-8">Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
      <Link to="/">
        <Button>Zur Startseite</Button>
      </Link>
    </div>
  );
}
