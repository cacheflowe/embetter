let css = /* css */ `

  :host {
    --anim-speed: 0.25s;
    transition: background-color var(--anim-speed) linear, max-width var(--anim-speed) linear, max-height var(--anim-speed) linear;
    background-color: #000;
    position: relative;
    display: block;
    overflow: hidden;
    padding: 0;
  }

  :host(:hover) {
    background-color: #000;
    border-color: #ffc;

    img {
      opacity: 0.9;
      transform: scale(1.02);
    }
    img.gif {
      opacity: 1;
      transform: initial;
    }
  }

  :host([playing]) {
    img {
      opacity: 0;
    }
    img.gif {
      opacity: 1;
    }

    .embetter-play-button {
      opacity: 0;
      pointer-events: none;
    }

    .embetter-loading {
      opacity: 1;
    }
  }

  :host([youtube-id]) {
    padding-bottom: 56.25%;
    height: 0;

    img {
      margin: -9.4% 0;
    }
  }

  :host([soundcloud-id]),
  :host([mixcloud-id]),
  :host([bandcamp-id]) {
    max-width: 660px;

    .embetter-play-button:before {
      background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2228%22%20fill%3D%22%23010101%22/%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M24%2018v24l20-12z%22/%3E%3C/svg%3E');
      background-size: 60px 60px;
      border-radius: 50%;
    }
  }

  a {
    display: block;
    line-height: 0;
    margin: 0;
  }

  img {
    transition: opacity var(--anim-speed) linear, transform var(--anim-speed) linear;
    width: 100%;
    margin: 0;
    display: block;
  }

  iframe,
  video,
  img.gif {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 1;
  }

  .embetter-play-button,
  .embetter-loading {
    transition: opacity 0.25s linear;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .embetter-play-button:before {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2286%22%20height%3D%2260%22%20viewBox%3D%220%200%2086%2060%22%3E%3Cpath%20fill%3D%22%23010101%22%20d%3D%22M0%200h86v60h-86z%22/%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M35.422%2017.6v24.8l22.263-12.048z%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 33.333% auto;
    width: 100%;
    max-width: 258px;
    height: 100%;
    min-height: 100%;
    content: " ";
    margin: 0 auto;
    display: block;
  }

  .embetter-loading {
    background-color: #000;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .embetter-loading:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: embetter-spin 0.8s linear infinite;
  }

  @keyframes embetter-spin {
    to { transform: rotate(360deg); }
  }

`;

export default css;
