/**
 * Created by andrey on 01.09.17.
 */

cleverapps.Shaders = {
    GRAYSCALE_SPRITE_KEY: "grayscaleSprite",
    FLICKER_SHADER_KEY: "flicker",
    BLUR_FADE_KEY: "blur_fade",
    BLUR_CURTAIN_KEY:  "blur_curtain",
    BLUR_CURTAIN_REVERSE_KEY: "blur_curtain_reverse",

    VERTEX_SRC:
    "  attribute vec4 a_position; \n"
    + "attribute vec2 a_texCoord; \n"
    + "attribute vec4 a_color;  \n"

    + "varying lowp vec4 v_fragmentColor; \n"
    + "varying mediump vec2 v_texCoord; \n"

    + "void main() \n"
    + "{ \n"
    + "    gl_Position = CC_PMatrix * a_position;  \n"
    + "    v_fragmentColor = a_color; \n"
    + "    v_texCoord = a_texCoord; \n"
    + "}",

    GRAYSCALE_SRC:
        "varying vec2 v_texCoord;\n" +
        "varying vec4 v_fragmentColor; \n" +
        "void main()" +
        "{" +
        "vec4 col = texture2D(CC_Texture0, v_texCoord);\n" +
        "float gray = dot(col.rgb, vec3(0.25, 0.25, 0.25));\n" +
        "gl_FragColor = v_fragmentColor * vec4(gray, gray, gray, col.a);\n" +
        "}\n",

    FLICKER_FRAGM:
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"

        + "uniform float sineTime; \n"
        + "uniform vec3 flickColor; \n"

        + "void main() \n"
        + "{ \n"
        + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
        + "    vec3 deltacolor = c.rgb * flickColor * sineTime;\n"
        + "    vec3 color = clamp(c.rgb + deltacolor, 0.0, 1.0);\n"
        + "    gl_FragColor = v_fragmentColor * vec4(color, c.a); \n"
        + "}",

    BLUR_TEMPLATE:
        "precision lowp float;\n" +
        "varying vec4 v_fragmentColor;\n" +
        "varying vec2 v_texCoord;\n" +

        "uniform float u_blurOffset;\n" +

        "uniform float u_extent;\n" +
        "uniform float u_blurStrength;\n" +

        "#define MAX_BLUR_WIDTH 4\n" +

        "bool skipPixel(float y)\n" +
        "{\n" +
        "   %{skipFunction}" +
        "}\n" +

        "void main()\n" +
        "{\n" +
        "    vec2 u_blurOffset1 = vec2(0.0, float(u_blurOffset));\n" +
        "    vec2 u_blurOffset2 = vec2(float(u_blurOffset), 0.0);\n" +
        "    vec2 u_blurOffset3 = vec2(float(u_blurOffset) * sqrt(2.0), float(u_blurOffset) * sqrt(2.0));\n" +
        "    vec2 u_blurOffset4 = vec2(float(u_blurOffset) * sqrt(2.0), -float(u_blurOffset) * sqrt(2.0));\n" +
        "    vec4 color = texture2D(CC_Texture0, v_texCoord);\n" +

        "    if (skipPixel(v_texCoord.y)) {\n" +
        "       gl_FragColor = color;\n" +
        "    } else {\n" +
        "       float blurWidth = u_blurStrength * float(MAX_BLUR_WIDTH);\n" +
        "       vec4 blurColor  = vec4(color.rgb, 1.0);\n" +
        "       for (int i = 1; i < MAX_BLUR_WIDTH; ++ i)\n" +
        "       {\n" +
        "           if ( float(i) >= blurWidth ) break;" +

        "           float weight = 1.0 - float(i) / blurWidth;\n" +
        "           weight = weight * weight * (3.0 - 2.0 * weight); // smoothstep\n" +

        "           vec4 sampleColor1 = texture2D(CC_Texture0, v_texCoord + u_blurOffset1 * float(i));\n" +
        "           vec4 sampleColor2 = texture2D(CC_Texture0, v_texCoord - u_blurOffset1 * float(i));\n" +
        "           vec4 sampleColor3 = texture2D(CC_Texture0, v_texCoord + u_blurOffset2 * float(i));\n" +
        "           vec4 sampleColor4 = texture2D(CC_Texture0, v_texCoord - u_blurOffset2 * float(i));\n" +
        "           vec4 sampleColor5 = texture2D(CC_Texture0, v_texCoord + u_blurOffset3 * float(i));\n" +
        "           vec4 sampleColor6 = texture2D(CC_Texture0, v_texCoord - u_blurOffset3 * float(i));\n" +
        "           vec4 sampleColor7 = texture2D(CC_Texture0, v_texCoord + u_blurOffset4 * float(i));\n" +
        "           vec4 sampleColor8 = texture2D(CC_Texture0, v_texCoord - u_blurOffset4 * float(i));\n" +
        "           blurColor += vec4(sampleColor1.rgb + sampleColor2.rgb + sampleColor3.rgb + sampleColor4.rgb + sampleColor5.rgb + sampleColor6.rgb + sampleColor7.rgb + sampleColor8.rgb, 8.0) * weight; \n" +
        "       }\n" +
        "       gl_FragColor = vec4(blurColor.rgb / blurColor.w, color.a);\n" +
        "    }\n" +
        "}",

    BLUR_FADE_FRAGM: "",
    BLUR_CURTAIN_FRAGM: "",
    BLUR_CURTAIN_REVERSE_FRAGM: "",
    BLUR_FADE_SKIP:  "   return false;\n",
    BLUR_CURTAIN_SKIP:  "   return y > u_extent;\n",
    BLUR_CURTAIN_REVERSE_SKIP: "   return y < (1. - u_extent);\n",

    initialize: function () {
        if (typeof gl === "undefined") {
            return;
        }

        var addProgram = function (key, vsh, fsh) {
            try {
                var program = new cc.GLProgram();
                program.initWithString(vsh, fsh);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);

                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, key);
            } catch (e) {
                cleverapps.Shaders[key] = undefined;
                console.log(e);
            }
        };

        cleverapps.Shaders.initializing = true;

        addProgram(cleverapps.Shaders.GRAYSCALE_SPRITE_KEY, cleverapps.Shaders.VERTEX_SRC, cleverapps.Shaders.GRAYSCALE_SRC);
        addProgram(cleverapps.Shaders.FLICKER_SHADER_KEY, cleverapps.Shaders.VERTEX_SRC, cleverapps.Shaders.FLICKER_FRAGM);

        cleverapps.Shaders.BLUR_FADE_FRAGM = cleverapps.Shaders.BLUR_TEMPLATE.replace('%{skipFunction}', cleverapps.Shaders.BLUR_FADE_SKIP);
        cleverapps.Shaders.BLUR_CURTAIN_FRAGM = cleverapps.Shaders.BLUR_TEMPLATE.replace('%{skipFunction}', cleverapps.Shaders.BLUR_CURTAIN_SKIP);
        cleverapps.Shaders.BLUR_CURTAIN_REVERSE_FRAGM = cleverapps.Shaders.BLUR_TEMPLATE.replace('%{skipFunction}', cleverapps.Shaders.BLUR_CURTAIN_REVERSE_SKIP);

        addProgram(cleverapps.Shaders.BLUR_FADE_KEY, cleverapps.Shaders.VERTEX_SRC, cleverapps.Shaders.BLUR_FADE_FRAGM);
        addProgram(cleverapps.Shaders.BLUR_CURTAIN_KEY, cleverapps.Shaders.VERTEX_SRC, cleverapps.Shaders.BLUR_CURTAIN_FRAGM);
        addProgram(cleverapps.Shaders.BLUR_CURTAIN_REVERSE_KEY, cleverapps.Shaders.VERTEX_SRC, cleverapps.Shaders.BLUR_CURTAIN_REVERSE_FRAGM);

        cleverapps.Shaders.initializing = false;
    }
};
