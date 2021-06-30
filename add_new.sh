
echo $1 # lowercase token
echo $2 # app name

mkdir -p src/app/assets/static/$1
cp src/app/assets/static/dunk/manifest.json src/app/assets/static/$1/manifest.json
sed -i -e "s!dunk!$1!" src/app/assets/static/$1/manifest.json
sed -i -e "s!DunkSocial!$2!" src/app/assets/static/$1/manifest.json

THEMES=$(cat <<END_HEREDOC
\$themes: (
  $1-light: (
    colorAccent: \$color-$1,
    colorAccentHover: \$color-$1,
    colorAccentReverse: \$color-blue-black,
    colorWhite: \$color-white,
    backgroundColor: \$color-background-off-white,
    backgroundColorEmphasis: \$color-background-almost-white,
    backgroundColorOpaque: \$color-background-off-white,
    backgroundTransparent: transparent,
    moduleBackgroundColor: \$color-white,
    menuBackgroundColor: \$color-background-dark,
    moduleMediumBackgroundColor: \$color-transparent,
    navBackgroundColor: \$color-white,
    highlightBackgroundColor: #f3faf0,
    tableRowEvenBackgroundColor: #f4f4f4,
    border: 1px solid \$color-border-light,
    borderLight: 1px solid \$color-border-light-lightest,
    borderDark: 1px solid \$color-text-gray,
    borderAccent: 1px solid \$color-$1,
    borderDotted: 1px dotted \$color-border-light,
    borderTransparent: transparent,
    iconColorSecondary: #cacaca,
    textColorPrimary: \$color-text-dark,
    textColorSecondary: \$color-text-gray,
    textColorAccent: \$color-$1,
    textColorAccentHover: \$color-$1,
    textColorError: \$color-text-red,
    contentBorderAccent: \$color-$1,
    buttonBackground: \$color-blue-black,
    buttonBackgroundHover: \$color-$1,
    buttonText: \$color-text-white,
    buttonTextShadow: 0 1px 0 rgba(0,0,0,0.20),
    buttonTextHover: \$color-white,
    buttonBoxShadow: \$color-$1,
    buttonBoxShadowHover: \$color-blue-black,
    modalBackgroundColor: \$color-white,
    modalTextColorPrimary: \$color-text-dark,
  ),
  $1-dark: (
    colorAccent: \$color-$1,
    colorAccentHover: \$color-$1,
    colorAccentReverse: \$color-white,
    colorWhite: \$color-white,
    backgroundColor: \$color-background-dark,
    backgroundColorEmphasis: \$color-background-super-dark,
    backgroundColorOpaque: \$color-blue-dark,
    moduleBackgroundColor: \$color-background-dark,
    backgroundTransparent: transparent,
    menuBackgroundColor: \$color-blue-dark,
    moduleMediumBackgroundColor: \$color-background-dark,
    navBackgroundColor: \$color-background-dark,
    highlightBackgroundColor: \$color-blue-black-darkest,
    tableRowEvenBackgroundColor: #212C33,
    border: 1px solid \$color-border-dark,
    borderLight: 1px solid \$color-border-dark-lightest,
    borderDark: 1px solid \$color-text-gray-light,
    borderAccent: 1px solid \$color-$1,
    borderDotted: 1px dotted \$color-border-dark,
    borderTransparent: transparent,
    iconColorSecondary: \$color-text-gray-light,
    textColorPrimary: \$color-text-white,
    textColorSecondary: \$color-text-gray-light,
    textColorAccent: \$color-$1,
    textColorAccentHover: \$color-$1,
    textColorError: \$color-text-red,
    contentBorderAccent: \$color-$1,
    buttonBackground: \$color-white,
    buttonBackgroundHover: \$color-$1,
    buttonText: \$color-blue-dark,
    buttonTextShadow: 0 1px 0 rgba(0,0,0,0),
    buttonTextHover: \$color-white,
    buttonBoxShadow: \$color-$1,
    buttonBoxShadowHover: \$color-white,
    inputPriceWarning: rgba(255, 153, 0, 0.83),
    modalBackgroundColor: \$color-white,
    modalTextColorPrimary: \$color-text-dark,
  ),
END_HEREDOC
)

sed -i -e "s!\$themes: (!$(echo "$THEMES" | sed ':a;N;$!ba;s/\n/\\n/g')!" src/app/assets/stylesheets/_themes.scss

THEMES2=$(cat <<END_HEREDOC

.theme-$1-light {
  background-color: \$white;
  color: \$color-text-dark;
  @include MQ(M) {
    background-color: \$color-background-off-white;
  }
}

.theme-$1-dark {
  background-color: \$color-background-dark;
  color: \$color-text-white;
  .button.hollow {
    &:hover, &:focus {
      border-color: \$color-$1;
      color: \$color-$1;
      outline-color: \$color-$1;
    }
  }
}
END_HEREDOC
)

echo "$THEMES2" >> src/app/assets/stylesheets/_themes.scss

echo "Find and place color in src/app/assets/stylesheets/_variables.scss"


