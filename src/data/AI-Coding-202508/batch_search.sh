#!/bin/bash

# 创建一个简化的应用列表进行搜索
apps=(
    "TRAE:trae.ai"
    "CodeArts Doer:codearts.com"
    "CODEFUSE:codefuse.ai"
    "CodeGeeX:codegeex.cn"
    "Lightly:lightly.ai"
    "通义灵码:tongyi.aliyun.com"
    "文心快码:wenxin.baidu.com"
    "VINSOO:vinsoo.com"
    "AiXCoder:aixcoder.com"
    "NoCode:nocode.com"
    "Wegic:wegic.ai"
    "Dify:dify.ai"
    "Qwen5-Coder:qwen.alibaba.com"
    "deepseek-coder:deepseek.com"
    "KIMI-K2:kimi.moonshot.cn"
    "CodeComplete:codecomplete.ai"
    "Kodezi:kodezi.com"
    "PIECES:pieces.app"
    "Refraction:refraction.dev"
    "SourceAI:sourceai.dev"
    "typo:typo.ai"
    "Voirflow:voirflow.com"
    "bloop:bloop.ai"
    "Magic:magic.dev"
    "BLACKBOXAI:blackbox.ai"
    "CodeMate.ai:codemate.ai"
    "AgentFarm:agentfarm.ai"
    "SOLVR:solvr.ai"
    "warp:warp.dev"
    "Zerve:zerve.ai"
    "Gitpod:gitpod.io"
    "Bito:bito.ai"
    "Cline:cline.ai"
    "Codegen:codegen.com"
    "CodeWP:codewp.ai"
    "Coframe:coframe.ai"
    "Devin:devin.ai"
    "FACTORY:factory.ai"
    "million:million.dev"
    "Neuralogics:neuralogics.ai"
    "perplexity:perplexity.ai"
    "Poolside:poolside.ai"
    "savery:savery.ai"
    "Sudocode:sudocode.ai"
    "Tusk:tusk.ai"
    "Vanna.AI:vanna.ai"
    "anima:anima.app"
    "Fine:fine.dev"
    "metatab.io:metatab.io"
    "Tempo:tempo.ai"
    "Base 44:base44.ai"
    "Bifrost:bifrost.ai"
    "COSINE:cosine.sh"
    "fume:fume.ai"
    "Gignite:gignite.ai"
    "HeroUI Chat:heroui.com"
    "Lovable:lovable.dev"
    "Pythagora:pythagora.ai"
    "Readdy:readdy.ai"
    "Taipy:taipy.io"
    "VIZ:viz.ai"
    "XAMUN.AI:xamun.ai"
)

echo "开始搜索应用信息..."
for app in "${apps[@]}"; do
    name=$(echo $app | cut -d: -f1)
    url=$(echo $app | cut -d: -f2)
    echo "搜索: $name - https://$url"
    
    # 尝试获取网站信息
    title=$(curl -s -m 5 "https://$url" | grep -o '<title>[^<]*</title>' | sed 's/<title>\(.*\)<\/title>/\1/' | head -1)
    desc=$(curl -s -m 5 "https://$url" | grep -o 'name="description" content="[^"]*"' | sed 's/name="description" content="\(.*\)"/\1/' | head -1)
    
    if [ ! -z "$title" ]; then
        echo "  标题: $title"
    fi
    if [ ! -z "$desc" ]; then
        echo "  描述: $desc"
    fi
    echo "---"
    sleep 1
done
